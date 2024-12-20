import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { closeInMongodConnection, rootMongooseTestModule } from "../utils/mongoose-test.utils";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";

describe("ApplicationController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let ensembleId: string;
  let postId: string;
  let applicationId: string;

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

    const createPostResponse = await request(app.getHttpServer()).post(`/post/${ensembleId}`).set("Authorization", `Bearer ${accessToken}`).send({
      title: "Test Post",
      description: "Test Description",
      website_url: "https://example.com",
      type: "Recruitment",
    });

    postId = createPostResponse.body._id;
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe("/application/:postId (POST)", () => {
    it("should create a new application", async () => {
      const createDto = {
        instrument: "Violin",
        message: "I would like to apply for this position",
      };

      const response = await request(app.getHttpServer()).post(`/application/${postId}`).set("Authorization", `Bearer ${accessToken}`).send(createDto).expect(201);

      applicationId = response.body._id;
      expect(response.body).toHaveProperty("message", createDto.message);
      expect(response.body).toHaveProperty("instrument", createDto.instrument);
      expect(response.body).toHaveProperty("status", "pending");
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer()).post(`/application/${postId}`).send({}).expect(401);
    });
  });

  describe("/application/post/:postId (GET)", () => {
    it("should get post applications", () => {
      return request(app.getHttpServer())
        .get(`/application/post/${postId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("_id");
            expect(res.body[0]).toHaveProperty("message");
            expect(res.body[0]).toHaveProperty("instrument");
            expect(res.body[0]).toHaveProperty("status");
          }
        });
    });
  });

  describe("/application/:applicationId/status (PATCH)", () => {
    it("should update application status", () => {
      return request(app.getHttpServer())
        .patch(`/application/${applicationId}/status`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ status: "approved" })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("status", "approved");
        });
    });
  });
});
