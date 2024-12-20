import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { closeInMongodConnection, rootMongooseTestModule } from "../utils/mongoose-test.utils";
import { Instrument } from "../../src/utils/types/enums";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";

describe("UsersController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;

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

    const userResponse = await request(app.getHttpServer()).post("/auth/login").send({
      email: "test@example.com",
      password: "Password123",
      first_name: "Test",
      last_name: "User",
      phone_number: "+4512345678",
    });

    accessToken = userResponse.body.accessToken;
  });

  afterEach(async () => {});

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe("/users/me (GET)", () => {
    it("should get current user profile", () => {
      return request(app.getHttpServer())
        .get("/users/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("_id");
        });
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer()).get("/users/me").expect(401);
    });
  });

  describe("/users/me (PUT)", () => {
    it("should update user profile", async () => {
      const updateDto = {
        first_name: "John",
        last_name: "Doe",
        location: {
          address: "Radhuspladsen 1",
          city: "Copenhagen",
          country: "Denmark",
        },
      };

      const response = await request(app.getHttpServer()).put("/users/me").set("Authorization", `Bearer ${accessToken}`).send(updateDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("first_name", updateDto.first_name);
      expect(response.body).toHaveProperty("last_name", updateDto.last_name);
      expect(response.body).toHaveProperty("location");
      expect(response.body.location).toHaveProperty("address", updateDto.location.address);
      expect(response.body.location).toHaveProperty("city", updateDto.location.city);
      expect(response.body.location).toHaveProperty("country", updateDto.location.country);
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer()).put("/users/me").send({ first_name: "John" }).expect(401);
    });
  });

  describe("/users/instruments (GET)", () => {
    it("should return list of instruments", () => {
      return request(app.getHttpServer())
        .get("/users/instruments")
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body).toEqual(Object.values(Instrument));
        });
    });
  });

  describe("/users/onboarding-status (GET)", () => {
    it("should get onboarding status", () => {
      return request(app.getHttpServer())
        .get("/users/onboarding-status")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("onboarded");
          expect(typeof res.body.onboarded).toBe("boolean");
        });
    });

    it("should return 401 if no auth token provided", () => {
      return request(app.getHttpServer()).get("/users/onboarding-status").expect(401);
    });
  });
});
