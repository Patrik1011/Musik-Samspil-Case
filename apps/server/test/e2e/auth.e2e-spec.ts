import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { closeInMongodConnection, rootMongooseTestModule } from "../utils/mongoose-test.utils";
import { User } from "../../src/schemas/user.schema";

describe("Auth API (e2e)", () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env.test",
        }),
        rootMongooseTestModule(),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await app.close();
    await closeInMongodConnection();
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "test@example.com",
          password: "Password123!",
          first_name: "Test",
          last_name: "User",
          phone_number: "+4512345678",
          instrument: "Violin",
        })
        .expect(201);

      expect(response.body).toHaveProperty("access_token");
    });

    it("should fail with invalid data", async () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "invalid-email",
          password: "123",
        })
        .expect(400);
    });

    it("should fail with duplicate email", async () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "test@example.com",
          password: "Password123!",
          first_name: "Test",
          last_name: "User",
          phone_number: "+4512345678",
          instrument: "Violin",
        })
        .expect(409);
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "Password123!",
        })
        .expect(200);

      expect(response.body).toHaveProperty("access_token");
      authToken = response.body.access_token;
    });

    it("should fail with incorrect password", async () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });

    it("should fail with non-existent email", async () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Password123!",
        })
        .expect(401);
    });
  });

  describe("GET /auth/profile", () => {
    it("should get user profile with valid token", async () => {
      return request(app.getHttpServer()).get("/auth/profile").set("Authorization", `Bearer ${authToken}`).expect(200);
    });

    it("should fail with invalid token", async () => {
      return request(app.getHttpServer()).get("/auth/profile").set("Authorization", "Bearer invalid-token").expect(401);
    });

    it("should fail with no token", async () => {
      return request(app.getHttpServer()).get("/auth/profile").expect(401);
    });
  });
});
