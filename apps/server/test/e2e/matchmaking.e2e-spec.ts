import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { closeInMongodConnection, rootMongooseTestModule } from '../utils/mongoose-test.utils';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

describe('Matchmaking (e2e)', () => {
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
    }).compile();

    app = moduleFixture.createNestApplication();
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

  describe('/matchmaking/recommendations (GET)', () => {
    it('should get recommendations based on location', async () => {
      const latitude = '55.6761';
      const longitude = '12.5683';

      return request(app.getHttpServer())
        .get(`/matchmaking/recommendations?latitude=${latitude}&longitude=${longitude}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('_id');
            expect(res.body[0]).toHaveProperty('distance');
          }
        });
    });

    it('should return 401 if no auth token provided', () => {
      const latitude = '55.6761';
      const longitude = '12.5683';

      return request(app.getHttpServer())
        .get(`/matchmaking/recommendations?latitude=${latitude}&longitude=${longitude}`)
        .expect(401);
    });
  });

  describe('/matchmaking/matches (GET)', () => {
    it('should get user matches', () => {
      return request(app.getHttpServer())
        .get('/matchmaking/matches')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('_id');
            expect(res.body[0]).toHaveProperty('status');
            expect(res.body[0]).toHaveProperty('liked');
          }
        });
    });

    it('should return 401 if no auth token provided', () => {
      return request(app.getHttpServer())
        .get('/matchmaking/matches')
        .expect(401);
    });
  });

  describe('/matchmaking/match (POST)', () => {
    it('should create a new match', () => {
      const ensembleId = new Types.ObjectId().toHexString();
      const matchData = {
        ensembleId,
        liked: true,
      };

      return request(app.getHttpServer())
        .post('/matchmaking/match')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(matchData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('ensemble');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('liked', true);
          expect(res.body).toHaveProperty('distance');
          expect(res.body).toHaveProperty('matched_at');
          expect(res.body).toHaveProperty('created_at');
        });
    });

    it('should return 401 if no auth token provided', () => {
      const ensembleId = new Types.ObjectId().toHexString();
      const matchData = {
        ensembleId,
        liked: true,
      };

      return request(app.getHttpServer())
        .post('/matchmaking/match')
        .send(matchData)
        .expect(401);
    });
  });
});
