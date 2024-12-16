import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Matchmaking } from "../../schemas/matchmaking.schema";
import { Ensemble } from "../../schemas/ensemble.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import { Types } from "mongoose";
import { startSession } from "mongoose";

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
  async getRecommendations(coordinates: Coordinates, radius = 50, limit = 10) {
    const { latitude, longitude } = coordinates;

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
      { $match: { is_active: true } },
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
      // Check if a match already exists
      const existingMatch = await Matchmaking.findOne({
        user: new Types.ObjectId(userId),
        ensemble: new Types.ObjectId(ensembleId),
      }).session(session);

      if (existingMatch) {
        throw new ConflictException("Match already exists for this user and ensemble");
      }

      const ensemble = await Ensemble.findById(ensembleId).session(session);
      if (!ensemble) throw new NotFoundException("Ensemble not found");

      // If the user liked the ensemble, check if they're already a member
      if (liked) {
        const existingMembership = await EnsembleMembership.findOne({
          member: new Types.ObjectId(userId),
          ensemble: new Types.ObjectId(ensembleId),
        }).session(session);

        if (existingMembership) {
          throw new ConflictException("User is already a member of this ensemble");
        }
      }

      const match = await Matchmaking.create(
        [
          {
            user: new Types.ObjectId(userId),
            ensemble: new Types.ObjectId(ensembleId),
            status: liked ? "pending" : "rejected",
            seen: false,
            // distance: ensemble.distance,
            liked,
            created_at: new Date(),
          },
        ],
        { session },
      );

      let result: Result;
      if (liked) {
        // For likes, populate the match with ensemble data
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
