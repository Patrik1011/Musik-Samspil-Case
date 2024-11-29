import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Types } from "mongoose";
import { EnsembleMembership } from "../../src/schemas/ensemble-membership.schema";
import { Ensemble } from "../../src/schemas/ensemble.schema";
import { EnsembleService } from "../../src/modules/ensemble/ensemble.service";

jest.mock("../../src/schemas/ensemble.schema");
jest.mock("../../src/schemas/ensemble-membership.schema");

describe("EnsembleService", () => {
  let service: EnsembleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnsembleService],
    }).compile();

    service = module.get<EnsembleService>(EnsembleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserHostedEnsembles", () => {
    it("should return hosted ensembles for a user", async () => {
      const userId = new Types.ObjectId().toHexString();
      const mockMemberships = [
        { ensemble: { name: "Jazz Band", description: "A cool jazz ensemble" } },
        { ensemble: { name: "Rock Band", description: "A rocking ensemble" } },
      ];

      (EnsembleMembership.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMemberships),
      });

      const result = await service.findUserHostedEnsembles(userId);

      expect(result).toEqual(mockMemberships.map((membership) => membership.ensemble));
      expect(EnsembleMembership.find).toHaveBeenCalledWith({
        member: new Types.ObjectId(userId),
        is_host: true,
      });
    });

    it("should throw an InternalServerErrorException on database error", async () => {
      const userId = new Types.ObjectId().toHexString();

      (EnsembleMembership.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(service.findUserHostedEnsembles(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("findOne", () => {
    const mockUserId = new Types.ObjectId().toHexString();
    const mockEnsembleId = new Types.ObjectId().toHexString();
    const mockMembership = {
      ensemble: new Types.ObjectId(mockEnsembleId),
      member: new Types.ObjectId(mockUserId),
    };
    const mockEnsemble = { name: "Jazz Band", description: "A cool jazz ensemble" };

    it("should return an ensemble if membership exists", async () => {
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(mockMembership);
      (Ensemble.findById as jest.Mock).mockResolvedValue(mockEnsemble);

      const result = await service.findOne(mockEnsembleId, mockUserId);

      expect(result).toEqual(mockEnsemble);
      expect(EnsembleMembership.findOne).toHaveBeenCalledWith({
        ensemble: new Types.ObjectId(mockEnsembleId),
        member: new Types.ObjectId(mockUserId),
      });
      expect(Ensemble.findById).toHaveBeenCalledWith(mockEnsembleId);
    });

    it("should throw ForbiddenException if membership is not found", async () => {
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(mockEnsembleId, mockUserId)).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException if ensemble is not found", async () => {
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(mockMembership);
      (Ensemble.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(mockEnsembleId, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it("should throw InternalServerErrorException on unexpected error", async () => {
      (EnsembleMembership.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(service.findOne(mockEnsembleId, mockUserId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("update", () => {
    it("should update an ensemble successfully", async () => {
      const mockEnsembleId = new Types.ObjectId().toHexString();
      const mockUserId = new Types.ObjectId().toHexString();
      const updateDto = { name: "Updated Ensemble", description: "Updated description" };
      const mockMembership = {
        ensemble: new Types.ObjectId(mockEnsembleId),
        member: new Types.ObjectId(mockUserId),
        is_host: true,
      };
      const mockUpdatedEnsemble = { ...updateDto };

      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(mockMembership);
      (Ensemble.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedEnsemble);

      const result = await service.update(mockEnsembleId, updateDto, mockUserId);

      expect(result).toEqual(mockUpdatedEnsemble);
      expect(EnsembleMembership.findOne).toHaveBeenCalledWith({
        ensemble: new Types.ObjectId(mockEnsembleId),
        member: new Types.ObjectId(mockUserId),
        is_host: true,
      });
      expect(Ensemble.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEnsembleId,
        {
          $set: {
            name: updateDto.name,
            description: updateDto.description,
          },
        },
        { new: true },
      );
    });

    it("should throw ForbiddenException when user lacks permission to update", async () => {
      const mockEnsembleId = new Types.ObjectId().toHexString();
      const mockUserId = new Types.ObjectId().toHexString();
      const updateDto = { name: "Updated Ensemble" };

      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(mockEnsembleId, updateDto, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(EnsembleMembership.findOne).toHaveBeenCalledWith({
        ensemble: new Types.ObjectId(mockEnsembleId),
        member: new Types.ObjectId(mockUserId),
        is_host: true,
      });
    });
  });

  describe("delete", () => {
    it("should delete an ensemble successfully", async () => {
      const mockEnsembleId = new Types.ObjectId().toHexString();
      const mockUserId = new Types.ObjectId().toHexString();
      const mockEnsemble = { _id: mockEnsembleId };

      (mongoose.startSession as jest.Mock).mockResolvedValue({
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      });

      (Ensemble.findById as jest.Mock).mockResolvedValue(mockEnsemble);
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue({
        ensemble: mockEnsembleId,
        member: mockUserId,
        is_host: true,
      });

      const session = await mongoose.startSession();

      const result = await service.delete(mockEnsembleId, mockUserId);

      expect(result).toEqual({ message: "Ensemble deleted successfully" });
      expect(Ensemble.findById).toHaveBeenCalledWith(mockEnsembleId);
      // expect(Post.deleteMany).toHaveBeenCalledWith({ ensemble_id: mockEnsemble._id }, { session });
      expect(EnsembleMembership.deleteMany).toHaveBeenCalledWith(
        { ensemble: mockEnsemble._id },
        { session },
      );
      expect(Ensemble.findByIdAndDelete).toHaveBeenCalledWith(mockEnsembleId, { session });
      expect(session.commitTransaction).toHaveBeenCalled();
    });

    it("should throw NotFoundException when ensemble does not exist", async () => {
      const mockEnsembleId = new Types.ObjectId().toHexString();
      const mockUserId = new Types.ObjectId().toHexString();

      (Ensemble.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(mockEnsembleId, mockUserId)).rejects.toThrow(NotFoundException);
      expect(Ensemble.findById).toHaveBeenCalledWith(mockEnsembleId);
    });
  });
});
