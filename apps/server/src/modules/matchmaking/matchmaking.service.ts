import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Matchmaking } from "../../schemas/matchmaking.schema";
import { Ensemble } from "../../schemas/ensemble.schema";
import { Types } from "mongoose";
import { startSession } from "mongoose";
import { User } from "../../schemas/user.schema";
import { calculateDistance } from "../../utils/location/calculate-distance";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Result {
  _id: string;
  user: Types.ObjectId;
  ensemble: Types.ObjectId;
  status: string;
  seen: boolean;
  liked: boolean;
  distance: number;
  matched_at: Date;
  created_at: Date;
}

@Injectable()
export class MatchmakingService {
  async getRecommendations(coordinates: Coordinates, userId: string, radius = 50, limit = 10) {
    const { latitude, longitude } = coordinates;

    // Get all ensemble IDs that the user has already matched with
    const existingMatches = await Matchmaking.find({
      user: new Types.ObjectId(userId),
    }).select("ensemble");

    const matchedEnsembleIds = existingMatches.map((match) => match.ensemble);

    const ensembles = await Ensemble.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: radius * 1000,
          spherical: true,
        },
      },
      {
        $match: {
          is_active: true,
          _id: { $nin: matchedEnsembleIds },
        },
      },
      { $limit: limit },
    ]);

    return ensembles;
  }

  async createMatch(userId: string, ensembleId: string, liked: boolean) {
    if (!Types.ObjectId.isValid(ensembleId)) {
      throw new BadRequestException("Invalid ensemble ID");
    }

    const session = await startSession();
    session.startTransaction();

    try {
      const existingMatch = await Matchmaking.findOne({
        user: new Types.ObjectId(userId),
        ensemble: new Types.ObjectId(ensembleId),
      }).session(session);

      if (existingMatch) {
        throw new ConflictException("Match already exists for this user and ensemble");
      }

      const [user, ensemble] = await Promise.all([
        User.findById(userId).session(session),
        Ensemble.findById(ensembleId).session(session),
      ]);

      if (!user || !ensemble) throw new NotFoundException("User or Ensemble not found");

      if (!user.location?.coordinates || !ensemble.location?.coordinates)
        throw new BadRequestException("User or ensemble location not found");

      const distanceCalc = calculateDistance(
        {
          type: "Point",
          coordinates: user.location.coordinates.coordinates,
        },
        {
          type: "Point",
          coordinates: ensemble.location.coordinates.coordinates,
        },
      );

      const match = await Matchmaking.create(
        [
          {
            user: new Types.ObjectId(userId),
            ensemble: new Types.ObjectId(ensembleId),
            status: liked ? "pending" : "rejected",
            seen: false,
            distance: distanceCalc,
            liked,
            created_at: new Date(),
          },
        ],
        { session },
      );

      let result: Result;
      if (liked) {
        result = await match[0].populate([
          {
            path: "ensemble",
            select: "name description location open_positions",
          },
          {
            path: "user",
            select: "first_name last_name email",
          },
        ]);
      } else {
        result = { ...match[0].toObject(), _id: match[0]._id.toString() };
      }

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }
}
