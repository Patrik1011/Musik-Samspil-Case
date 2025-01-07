import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { rootMongooseTestModule, closeInMongodConnection } from "../utils/mongoose-test.utils";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";

describe("Auth API (e2e)", () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe("POST /auth/signup", () => {
    it("should register a new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          email: "testRegister@gmail.com",
          password: "Password123",
          first_name: "Test",
          last_name: "User",
          phone_number: "+4512345678",
          instrument: "Violin",
        })
        .expect(201);

      expect(response.body).toHaveProperty("accessToken");
      accessToken = response.body.accessToken;
    });

    it("should fail with duplicate email", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          email: "testRegister@gmail.com",
          password: "Password123",
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
          email: "testRegister@gmail.com",
          password: "Password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("onboarded");
      accessToken = response.body.accessToken;
    });

    it("should fail with incorrect password", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "testRegister@gmail.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });
});
