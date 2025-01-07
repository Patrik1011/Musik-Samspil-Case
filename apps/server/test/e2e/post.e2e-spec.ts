import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { closeInMongodConnection, rootMongooseTestModule } from "../utils/mongoose-test.utils";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";
import { PostType } from "../../src/utils/types/enums";

describe("PostController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let ensembleId: string;
  let postId: string;

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

  describe("/post (POST)", () => {
    it("should create a new post", async () => {
      const createDto = {
        title: "Test Post",
        description: "Test Description",
        website_url: "https://example.com",
        type: PostType.Recruitment,
      };

      const response = await request(app.getHttpServer())
        .post(`/post/${ensembleId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(createDto)
        .expect(201);

      postId = response.body._id;
      expect(response.body).toHaveProperty("title", createDto.title);
      expect(response.body).toHaveProperty("description", createDto.description);
      expect(response.body).toHaveProperty("website_url", createDto.website_url);
      expect(response.body).toHaveProperty("type", createDto.type);
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer()).post(`/post/${ensembleId}`).send({}).expect(401);
    });
  });

  describe("/post/search (POST)", () => {
    it("should search posts with criteria", async () => {
      const response = await request(app.getHttpServer())
        .post("/post/searchPost")
        .send({
          instrument: "Violin",
          location: "Copenhagen",
          genericText: "Test",
        })
        .expect(201);

      expect(Array.isArray(response.body)).toBeTruthy();
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("title");
        expect(response.body[0]).toHaveProperty("description");
      }
    });
  });

  describe("/post/latest (GET)", () => {
    it("should get latest posts", async () => {
      const response = await request(app.getHttpServer()).get("/post/latest").expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("title");
        expect(response.body[0]).toHaveProperty("created_at");
      }
    });
  });

  describe("/post/:id (DELETE)", () => {
    it("should delete post", async () => {
      await request(app.getHttpServer())
        .delete(`/post/${postId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      await request(app.getHttpServer()).get(`/post/${postId}`).expect(500);
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer()).delete(`/post/${postId}`).expect(401);
    });
  });
});
