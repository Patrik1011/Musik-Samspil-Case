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
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";

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

    const existingMatches = await Matchmaking.find({
      user: new Types.ObjectId(userId),
    }).select("ensemble");

    const hostedEnsembles = await EnsembleMembership.find({
      member_id: userId,
      is_host: true,
    }).select("ensemble_id");

    const excludeEnsembleIds = [
      ...existingMatches.map((match: { ensemble: Types.ObjectId }) => match.ensemble),
      ...hostedEnsembles.map(
        (membership: { ensemble_id: string }) => new Types.ObjectId(membership.ensemble_id),
      ),
    ];

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
          key: "location.coordinates",
        },
      },
      {
        $match: {
          is_active: true,
          _id: { $nin: excludeEnsembleIds },
        },
      },
      { $limit: limit },
    ]);

    return ensembles;
  }

  async getMatches(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }

    const memberships = await EnsembleMembership.find({
      member_id: userId,
      is_host: true,
    });

    const hostedEnsembleIds = memberships.map(
      (membership: { ensemble_id: string }) => new Types.ObjectId(membership.ensemble_id),
    );

    const matches = await Matchmaking.aggregate([
      {
        $match: {
          ensemble: { $in: hostedEnsembleIds.map((id: Types.ObjectId) => id) },
          liked: true,
          status: { $in: ["matched", "pending"] },
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $lookup: {
          from: "Ensemble",
          localField: "ensemble",
          foreignField: "_id",
          as: "ensembleData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $unwind: "$ensembleData",
      },
      {
        $project: {
          _id: 1,
          ensemble_id: "$ensemble",
          created_at: "$created_at",
          status: 1,
          "user.first_name": "$userData.first_name",
          "user.last_name": "$userData.last_name",
          "user.email": "$userData.email",
          "user.phone_number": "$userData.phone_number",
          "user.bio": "$userData.bio",
          "user.instruments": "$userData.instruments",
          "user.location.city": "$userData.location.city",
          "user.location.country": "$userData.location.country",
          "user.location.address": "$userData.location.address",
          "ensemble.name": "$ensembleData.name",
          "ensemble.description": "$ensembleData.description",
          "ensemble.open_positions": "$ensembleData.open_positions",
        },
      },
    ]);

    return matches;
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
            user_id: userId,
            ensemble: new Types.ObjectId(ensembleId),
            ensemble_id: ensembleId,
            status: liked ? "pending" : "rejected",
            distance: distanceCalc,
            seen: false,
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
