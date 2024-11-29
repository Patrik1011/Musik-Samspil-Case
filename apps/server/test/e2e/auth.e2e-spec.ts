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

  afterAll(async () => {
    await app.close();
  });

  describe("Auth API (e2e) - SIGNUP", () => {
    afterEach(async () => {
      await deleteUserIfExists(validUser.email as string);
    });

    it("should register a new user", async () => {
      const res = await sendSignUpRequest(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.accessToken).toBeTruthy();
    });

    // it("should not register a user with an existing email", async () => {
    //   await sendSignUpRequest(validUser);
    //   const res = await sendSignUpRequest(validUser);

    //   expectErrorResponse(res, 409, ERROR_MESSAGES.emailAlreadyExists(validUser.email as string));
    // });

    // it("should not register a user with an invalid email", async () => {
    //   const invalidUser = { ...validUser, email: "invalidEmail" };
    //   const res = await sendSignUpRequest(invalidUser);

    //   expectErrorResponse(res, 400, ERROR_MESSAGES.invalidEmail);
    // });

    // it("should not register a user with a password less than 6 characters", async () => {
    //   const invalidUser = { ...validUser, password: "pass" };
    //   const res = await sendSignUpRequest(invalidUser);

    //   expectErrorResponse(res, 400, ERROR_MESSAGES.shortPassword);
    // });

    // it("should not register a user with a missing firstname", async () => {
    //   const invalidUser = { ...validUser, firstname: "" };
    //   const res = await sendSignUpRequest(invalidUser);

    //   expectErrorResponse(res, 400, ERROR_MESSAGES.missingFirstName);
    // });

    // it("should not register a user with a missing lastname", async () => {
    //   const invalidUser = { ...validUser, lastname: "" };
    //   const res = await sendSignUpRequest(invalidUser);

    //   expectErrorResponse(res, 400, ERROR_MESSAGES.missingLastName);
    // });

    // it("should not register a user with a missing password", async () => {
    //   const invalidUser = { ...validUser, password: "" };
    //   const res = await sendSignUpRequest(invalidUser);

    //   expectErrorResponse(res, 400, ERROR_MESSAGES.missingPassword);
    // });

    // it("should not register a user with a missing email", async () => {
    //   const invalidUser = { ...validUser, email: "" };
    //   const res = await sendSignUpRequest(invalidUser);

    //   expectErrorResponse(res, 400, ERROR_MESSAGES.invalidEmail);
    // });
  });

  describe("Auth API (e2e) - LOGIN", () => {
    afterEach(async () => {
      await deleteUserIfExists(validUser.email as string);
    });

    it("should login a user", async () => {
      await sendSignUpRequest(validUser);
      const loginDto = { email: validUser.email, password: validUser.password };
      const res = await request(app.getHttpServer()).post("/auth/login").send(loginDto);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.accessToken).toBeTruthy();
    });

    it("should not login a user with incorrect password", async () => {
      await sendSignUpRequest(validUser);
      const loginDto = { email: validUser.email, password: "wrongpassword" };
      const res = await request(app.getHttpServer()).post("/auth/login").send(loginDto);

      expectErrorResponse(res, 401, ERROR_MESSAGES.incorrectPassword);
    });

    it("should not login a user with non-existing email", async () => {
      await sendSignUpRequest(validUser);
      const loginDto = { email: "non.existing@example.com", password: validUser.password };
      const res = await request(app.getHttpServer()).post("/auth/login").send(loginDto);

      expectErrorResponse(res, 404, `User with email: ${loginDto.email} was not found`);
    });
  });
});
