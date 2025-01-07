import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { closeInMongodConnection, rootMongooseTestModule } from "../utils/mongoose-test.utils";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";

describe("Matchmaking (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let ensembleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env.test",
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
    await app.init();

    const loginResponse = await request(app.getHttpServer()).post("/auth/login").send({
      email: "test@example.com",
      password: "Password123",
    });

    accessToken = loginResponse.body.accessToken;

    const createEnsembleResponse = await request(app.getHttpServer())
      .post("/ensemble")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Ensemble",
        description: "Test Description",
        location: {
          address: "Radhuspladsen 1",
          city: "Copenhagen",
          country: "Denmark",
        },
        open_positions: ["Violin"],
        is_active: true,
      });

    ensembleId = createEnsembleResponse.body._id;
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe("/matchmaking/recommendations (GET)", () => {
    it("should get recommendations based on location", async () => {
      const response = await request(app.getHttpServer())
        .get("/matchmaking/recommendations")
        .query({
          latitude: "55.6761",
          longitude: "12.5683",
        })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("distance");
      }
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer())
        .get("/matchmaking/recommendations")
        .query({
          latitude: "55.6761",
          longitude: "12.5683",
        })
        .expect(401);
    });
  });

  describe("/matchmaking/match (POST)", () => {
    it("should create a new match", async () => {
      const matchData = {
        ensembleId,
        liked: true,
      };

      const response = await request(app.getHttpServer())
        .post("/matchmaking/match")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(matchData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("ensemble");
      expect(response.body).toHaveProperty("status", "pending");
      expect(response.body).toHaveProperty("liked", true);
      expect(response.body).toHaveProperty("distance");
      expect(response.body).toHaveProperty("created_at");
    });
  });
});
