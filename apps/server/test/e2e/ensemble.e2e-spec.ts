import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ConfigModule } from "@nestjs/config";
import { closeInMongodConnection, rootMongooseTestModule } from "../utils/mongoose-test.utils";
import { GeocodingService } from "../../src/modules/geocoding/geocoding.service";

describe("EnsembleController (e2e)", () => {
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
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe("/ensemble (POST)", () => {
    it("should create a new ensemble", async () => {
      const createDto = {
        name: "Test Ensemble",
        description: "Test Description",
        location: {
          address: "Radhuspladsen 1",
          city: "Copenhagen",
          country: "Denmark",
        },
        open_positions: ["Violin"],
        is_active: true,
      };

      const response = await request(app.getHttpServer()).post("/ensemble").set("Authorization", `Bearer ${accessToken}`).send(createDto).expect(201);

      ensembleId = response.body._id;
      expect(response.body).toHaveProperty("name", createDto.name);
      expect(response.body).toHaveProperty("description", createDto.description);
    });
  });

  describe("/ensemble/:id (GET)", () => {
    it("should get ensemble by id", () => {
      return request(app.getHttpServer())
        .get(`/ensemble/${ensembleId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("_id", ensembleId);
          expect(res.body).toHaveProperty("name");
          expect(res.body).toHaveProperty("description");
          expect(res.body).toHaveProperty("location");
          expect(res.body).toHaveProperty("open_positions");
        });
    });
  });

  describe("/ensemble/:id (PUT)", () => {
    it("should update ensemble", () => {
      const updateDto = {
        name: "Updated Ensemble",
        description: "Updated Description",
        open_positions: ["Piano"],
      };

      return request(app.getHttpServer())
        .put(`/ensemble/${ensembleId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("name", updateDto.name);
          expect(res.body).toHaveProperty("description", updateDto.description);
          expect(res.body.open_positions).toEqual(updateDto.open_positions);
        });
    });
  });

  describe("/ensemble/:id (DELETE)", () => {
    it("should delete ensemble", () => {
      return request(app.getHttpServer()).delete(`/ensemble/${ensembleId}`).set("Authorization", `Bearer ${accessToken}`).expect(200);
    });
  });
});
