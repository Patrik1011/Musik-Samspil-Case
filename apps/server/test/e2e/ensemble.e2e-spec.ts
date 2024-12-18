import { Test, TestingModule } from '@nestjs/testing';
import { EnsembleService } from '../../src/modules/ensemble/ensemble.service';
import { Types } from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateEnsembleDto } from '../../src/modules/ensemble/dto/create-ensemble.dto';
import { Ensemble } from '../../src/schemas/ensemble.schema';
import { EnsembleMembership } from '../../src/schemas/ensemble-membership.schema';
import { GeocodingService } from '../../src/modules/geocoding/geocoding.service';
import { Instrument } from '../../src/utils/types/enums';
import { Post } from '../../src/schemas/post.schema';

jest.mock('../../src/schemas/ensemble.schema');
jest.mock('../../src/schemas/ensemble-membership.schema');
jest.mock('../../src/schemas/post.schema');

describe('EnsembleService', () => {
  let service: EnsembleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnsembleService,
        {
          provide: GeocodingService,
          useValue: {
            geocodeAddress: jest.fn().mockResolvedValue({ latitude: 0, longitude: 0 }),
          },
        },
      ],
    }).compile();

    service = module.get<EnsembleService>(EnsembleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWithHost', () => {
    it('should create an ensemble with host', async () => {
      const userId = new Types.ObjectId().toHexString();
      const createDto: CreateEnsembleDto = {
        name: 'Test Ensemble',
        description: 'Test Description',
        location: {
          city: 'Test City',
          country: 'Test Country',
          address: 'Test Address',
          coordinates: { type: 'Point', coordinates: [0, 0] }
        },
        open_positions: [Instrument.Violin],
        is_active: true
      };

      const mockEnsemble = [{ 
        _id: new Types.ObjectId(),
        ...createDto
      }];

      (Ensemble.create as jest.Mock).mockResolvedValue(mockEnsemble);
      (EnsembleMembership.create as jest.Mock).mockResolvedValue([{ ensemble: mockEnsemble[0]._id, member: userId }]);

      const result = await service.createWithHost(createDto, userId);
      expect(result).toEqual(mockEnsemble[0]);
    });
  });

  describe('findOne', () => {
    it('should return an ensemble by id', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();
      const mockEnsemble = { _id: ensembleId, name: 'Test Ensemble' };
      const mockMembership = { ensemble: ensembleId, member: userId };

      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(mockMembership);
      (Ensemble.findById as jest.Mock).mockResolvedValue(mockEnsemble);

      const result = await service.findOne(ensembleId, userId);
      expect(result).toEqual(mockEnsemble);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();

      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(ensembleId, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update an ensemble when user is host', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();
      const updateDto = { name: 'Updated Ensemble' };
      const mockEnsemble = { _id: ensembleId, ...updateDto };

      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue({ is_host: true });
      (Ensemble.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockEnsemble);

      const result = await service.update(ensembleId, updateDto, userId);
      expect(result).toEqual(mockEnsemble);
    });

    it('should throw ForbiddenException when user is not host', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();
      
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(ensembleId, {}, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete an ensemble and related data', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();
      const mockEnsemble = { _id: ensembleId };

      (Ensemble.findById as jest.Mock).mockResolvedValue(mockEnsemble);
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue({ is_host: true });
      (Post.deleteMany as jest.Mock).mockResolvedValue({});
      (EnsembleMembership.deleteMany as jest.Mock).mockResolvedValue({});
      (Ensemble.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      const result = await service.delete(ensembleId, userId);
      expect(result).toEqual({ message: 'Ensemble deleted successfully' });
    });

    it('should throw ForbiddenException when user is not host', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();
      
      (Ensemble.findById as jest.Mock).mockResolvedValue({ _id: ensembleId });
      (EnsembleMembership.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(ensembleId, userId)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when ensemble not found', async () => {
      const userId = new Types.ObjectId().toHexString();
      const ensembleId = new Types.ObjectId().toHexString();
      
      (Ensemble.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(ensembleId, userId)).rejects.toThrow(NotFoundException);
    });
  });
});
