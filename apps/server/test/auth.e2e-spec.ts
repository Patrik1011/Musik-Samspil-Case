import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { SignUpDto } from "../src/modules/auth/dto/signup.dto";
import { PrismaService } from "../src/prisma/prisma.service";
import { beforeEach } from "node:test";

describe("Auth API (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const validUser: SignUpDto = {
    firstname: "John",
    lastname: "Doe",
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
  };

  async function sendSignUpRequest(user: SignUpDto) {
    return request(app.getHttpServer()).post("/auth/signup").send(user);
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
        transform: true,
      }),
    );
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: "john.doe@example.com" } });
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Auth API (e2e) - SIGNUP", () => {
    it("/api/signup (POST) should register a new user", async () => {
      const res = await sendSignUpRequest(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.accessToken).toBeTruthy();
    });

    it("/api/signup (POST) should not register a user with an existing email", async () => {
      await sendSignUpRequest(validUser);

      const res = await sendSignUpRequest(validUser);
      expectErrorResponse(res, 409, ERROR_MESSAGES.emailAlreadyExists(validUser.email as string));
    });

    it("/api/signup (POST) should not register a user with an invalid email", async () => {
      const invalidUser = { ...validUser, email: "invalidEmail" };
      const res = await sendSignUpRequest(invalidUser);

      expectErrorResponse(res, 400, ERROR_MESSAGES.invalidEmail);
    });

    it("/api/signup (POST) should not register a user with a password less than 6 characters", async () => {
      const invalidUser = { ...validUser, password: "pass" };
      const res = await sendSignUpRequest(invalidUser);

      expectErrorResponse(res, 400, ERROR_MESSAGES.shortPassword);
    });

    it("/api/signup (POST) should not register a user with a missing firstname", async () => {
      const invalidUser = { ...validUser, firstname: "" };
      const res = await sendSignUpRequest(invalidUser);

      expectErrorResponse(res, 400, ERROR_MESSAGES.missingFirstName);
    });

    it("/api/signup (POST) should not register a user with a missing lastname", async () => {
      const invalidUser = { ...validUser, lastname: "" };
      const res = await sendSignUpRequest(invalidUser);

      expectErrorResponse(res, 400, ERROR_MESSAGES.missingLastName);
    });

    it("/api/signup (POST) should not register a user with a missing password", async () => {
      const invalidUser = { ...validUser, password: "" };
      const res = await sendSignUpRequest(invalidUser);

      expectErrorResponse(res, 400, ERROR_MESSAGES.missingPassword);
    });

    it("/api/signup (POST) should not register a user with a missing email", async () => {
      const invalidUser = { ...validUser, email: "" };
      const res = await sendSignUpRequest(invalidUser);

      expectErrorResponse(res, 400, ERROR_MESSAGES.invalidEmail);
    });
  });
});
