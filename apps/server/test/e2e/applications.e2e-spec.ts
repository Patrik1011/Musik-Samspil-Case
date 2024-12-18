import { Test, type TestingModule } from "@nestjs/testing";
import { type INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import type { SignUpDto } from "../../src/modules/auth/dto/signup.dto";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "../../src/schemas/user.schema";
import { describe } from "node:test";

describe("Auth API (e2e)", () => {
  let app: INestApplication;
  let userModel: Model<typeof User>;

  const validUser: SignUpDto = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    password: "password123",
  };

  const ERROR_MESSAGES = {
    emailAlreadyExists: (email: string) => `User with email ${email} already exists`,
    invalidEmail: "email must be an email",
    shortPassword: "password must be longer than or equal to 6 characters",
    missingFirstName: "firstname should not be empty",
    missingLastName: "lastname should not be empty",
    missingPassword: "password should not be empty",
    incorrectPassword: "Incorrect password",
  };

  async function sendSignUpRequest(user: SignUpDto) {
    return request(app.getHttpServer()).post("/auth/signup").send(user);
  }

  async function deleteUserIfExists(email: string) {
    await userModel.deleteMany({ email });
  }

  function expectErrorResponse(res: request.Response, statusCode: number, errorMessage: string) {
    expect(res.status).toBe(statusCode);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain(errorMessage);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: false,
      }),
    );
    userModel = moduleFixture.get<Model<typeof User>>(getModelToken("User"));
    await app.init();
  });
});
