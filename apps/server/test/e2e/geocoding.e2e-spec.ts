import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { GeocodingService } from '../../src/modules/geocoding/geocoding.service';
import { INestApplication } from '@nestjs/common';

describe('GeocodingService (e2e)', () => {
  let app: INestApplication;
  let geocodingService: GeocodingService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [GeocodingService],
    }).compile();

    app = moduleFixture.createNestApplication();
    geocodingService = moduleFixture.get<GeocodingService>(GeocodingService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('geocodeAddress', () => {
    it('should successfully geocode a valid address', async () => {
      const address = 'Hviddingvej 2B, Copenhagen, Denmark';
      const result = await geocodingService.geocodeAddress(address);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('latitude');
      expect(result).toHaveProperty('longitude');
      expect(typeof result.latitude).toBe('number');
      expect(typeof result.longitude).toBe('number');
      // Copenhagen's approximate coordinates
      expect(result.latitude).toBeGreaterThan(55.5);
      expect(result.latitude).toBeLessThan(56.0);
      expect(result.longitude).toBeGreaterThan(12.0);
      expect(result.longitude).toBeLessThan(13.0);
    });

    it('should throw an error for an invalid address', async () => {
      const invalidAddress = 'ThisIsNotARealAddress12345';

      await expect(geocodingService.geocodeAddress(invalidAddress)).rejects.toThrow();
    });

    it('should handle empty address input', async () => {
      const emptyAddress = '';

      await expect(geocodingService.geocodeAddress(emptyAddress)).rejects.toThrow();
    });

    it('should handle special characters in address', async () => {
      const addressWithSpecialChars = 'Øster Farimagsgade 5, København, Danmark';
      const result = await geocodingService.geocodeAddress(addressWithSpecialChars);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('latitude');
      expect(result).toHaveProperty('longitude');
      expect(typeof result.latitude).toBe('number');
      expect(typeof result.longitude).toBe('number');
    });
  });
});
