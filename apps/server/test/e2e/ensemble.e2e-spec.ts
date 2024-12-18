import { Test, TestingModule } from '@nestjs/testing';
import { EnsembleService } from '../../src/modules/ensemble/ensemble.service';
import { Types } from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateEnsembleDto } from '../../src/modules/ensemble/dto/create-ensemble.dto';
import { Ensemble } from '../../src/schemas/ensemble.schema';
import { EnsembleMembership } from '../../src/schemas/ensemble-membership.schema';
import { GeocodingService } from '../../src/modules/geocoding/geocoding.service';
import { Instrument } from '../../src/utils/types/enums';

jest.mock('../../src/schemas/ensemble.schema');
jest.mock('../../src/schemas/ensemble-membership.schema');

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
});
