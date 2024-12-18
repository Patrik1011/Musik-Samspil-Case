import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../utils/mongoose-test.utils';
import { Instrument } from '../../src/utils/types/enums';
import { GeocodingService } from '../../src/modules/geocoding/geocoding.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  const userId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        rootMongooseTestModule(),
        AppModule,
      ],
      providers: [
        {
          provide: GeocodingService,
          useValue: {
            geocodeAddress: jest.fn().mockResolvedValue({ latitude: 0, longitude: 0 }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

    // Create a test JWT token
    accessToken = jwtService.sign({ sub: userId });
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('/users/me (GET)', () => {
    it('should get current user profile', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body._id).toBe(userId);
        });
    });

    it('should return 401 if no auth token provided', () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });
  });

  describe('/users/me (PUT)', () => {
    it('should update user profile', () => {
      const updateDto = {
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Updated bio',
        instrument: Instrument.Piano,
        location: {
          city: 'Copenhagen',
          country: 'Denmark',
          address: 'Test Street 123',
        },
      };

      return request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('first_name', updateDto.first_name);
          expect(res.body).toHaveProperty('last_name', updateDto.last_name);
          expect(res.body).toHaveProperty('bio', updateDto.bio);
          expect(res.body).toHaveProperty('instrument', updateDto.instrument);
          expect(res.body.location).toHaveProperty('city', updateDto.location.city);
          expect(res.body.location).toHaveProperty('coordinates');
        });
    });

    it('should return 401 if no auth token provided', () => {
      return request(app.getHttpServer())
        .put('/users/me')
        .send({ first_name: 'John' })
        .expect(401);
    });
  });

  describe('/users/instruments (GET)', () => {
    it('should return list of instruments', () => {
      return request(app.getHttpServer())
        .get('/users/instruments')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body).toEqual(Object.values(Instrument));
        });
    });
  });

  describe('/users/onboarding-status (GET)', () => {
    it('should get onboarding status', () => {
      return request(app.getHttpServer())
        .get('/users/onboarding-status')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('isComplete');
          expect(typeof res.body.isComplete).toBe('boolean');
        });
    });

    it('should return 401 if no auth token provided', () => {
      return request(app.getHttpServer()).get('/users/onboarding-status').expect(401);
    });
  });

  describe('/users/onboarding (POST)', () => {
    it('should complete onboarding', () => {
      const onboardingDto = {
        instrument: Instrument.Piano,
        bio: 'Test bio',
        location: {
          city: 'Copenhagen',
          country: 'Denmark',
          address: 'Test Street 123',
        },
      };

      return request(app.getHttpServer())
        .post('/users/onboarding')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(onboardingDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('instrument', onboardingDto.instrument);
          expect(res.body).toHaveProperty('bio', onboardingDto.bio);
          expect(res.body.location).toHaveProperty('city', onboardingDto.location.city);
          expect(res.body.location).toHaveProperty('coordinates');
        });
    });

    it('should return 401 if no auth token provided', () => {
      return request(app.getHttpServer())
        .post('/users/onboarding')
        .send({ instrument: Instrument.Piano })
        .expect(401);
    });
  });
});
