import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { EnsembleService } from "./ensemble.service";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import { Ensemble } from "../../schemas/ensemble.schema";

jest.mock("../../schemas/ensemble.schema");
jest.mock("../../schemas/ensemble-membership.schema");

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

  describe("create", () => {
    it("should create an ensemble successfully", async () => {
      const mockEnsembleData = {
        name: "Jazz Band",
        description: "A cool jazz ensemble",
        location: { type: "Point", coordinates: ["40.7128", "-74.0060"] },
        open_positions: ["Saxophonist"],
        is_active: true,
      };

      (Ensemble.create as jest.Mock).mockResolvedValue(mockEnsembleData);

      const result = await service.create(mockEnsembleData);

      expect(result).toEqual(mockEnsembleData);
      expect(Ensemble.create).toHaveBeenCalledWith(mockEnsembleData);
    });

    it("should throw an InternalServerErrorException on database error", async () => {
      const mockEnsembleData = {
        name: "Jazz Band",
        description: "A cool jazz ensemble",
        location: { type: "Point", coordinates: ["40.7128", "-74.0060"] },
        open_positions: ["Saxophonist"],
        is_active: true,
      };

      (Ensemble.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(service.create(mockEnsembleData)).rejects.toThrow();
    });
  });

  describe("findAll", () => {
    it("should return a list of ensembles", async () => {
      const mockEnsembles = [
        { name: "Jazz Band", description: "A cool jazz ensemble" },
        { name: "Rock Band", description: "A rocking ensemble" },
      ];

      (Ensemble.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEnsembles),
      });

      const result = await service.findAll();
      expect(result).toEqual(mockEnsembles);
      expect(Ensemble.find).toHaveBeenCalledTimes(1);
    });

    it("should throw an error on database failure", async () => {
      (Ensemble.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe("findOne", () => {
    it("should return an ensemble by ID", async () => {
      const validObjectId = new Types.ObjectId().toHexString();
      const mockEnsemble = { name: "Jazz Band", description: "A cool jazz ensemble" };

      (Ensemble.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEnsemble),
      });

      const result = await service.findOne(validObjectId);
      expect(result).toEqual(mockEnsemble);
      expect(Ensemble.findById).toHaveBeenCalledWith(validObjectId);
    });

    it("should throw a NotFoundException if ensemble is not found", async () => {
      (Ensemble.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne("validObjectId")).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should update an ensemble successfully", async () => {
      const validObjectId = new Types.ObjectId().toHexString();
      const mockUpdatedEnsemble = { name: "Updated Band", description: "Updated description" };
      const mockUpdateData = { name: "Updated Band" };

      (Ensemble.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedEnsemble);

      const result = await service.update(validObjectId, mockUpdateData);
      expect(result).toEqual(mockUpdatedEnsemble);
      expect(Ensemble.findByIdAndUpdate).toHaveBeenCalledWith(
        validObjectId,
        { $set: mockUpdateData },
        { new: true },
      );
    });

    it("should throw a NotFoundException if ensemble is not found", async () => {
      const mockUpdateData = { name: "Updated Band" };

      (Ensemble.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(service.update("validObjectId", mockUpdateData)).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete an ensemble successfully", async () => {
      const validObjectId = new Types.ObjectId().toHexString();

      const mockEnsemble = { name: "Jazz Band" };

      (Ensemble.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEnsemble);

      const result = await service.delete(validObjectId);
      expect(result).toEqual(mockEnsemble);
      expect(Ensemble.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
    });

    it("should throw a NotFoundException if ensemble is not found", async () => {
      (Ensemble.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(service.delete("validObjectId")).rejects.toThrow();
    });
  });

  describe("findUserHostedEnsembles", () => {
    it("should return hosted ensembles for a user", async () => {
      const validObjectId = new Types.ObjectId().toHexString();

      const mockMemberships = [
        { ensemble: { name: "Jazz Band" } },
        { ensemble: { name: "Rock Band" } },
      ];

      (EnsembleMembership.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMemberships),
      });

      const result = await service.findUserHostedEnsembles(validObjectId);
      expect(result).toEqual(mockMemberships.map((membership) => membership.ensemble));
      expect(EnsembleMembership.find).toHaveBeenCalledWith({
        member: new Types.ObjectId(validObjectId),
        is_host: true,
      });
    });

    it("should throw an error on database failure", async () => {
      (EnsembleMembership.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await expect(service.findUserHostedEnsembles("validUserId")).rejects.toThrow();
    });
  });
});
