import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../../schemas/user.schema";
import type { SignUpDto } from "./dto/signup.dto";
import type { LoginDto } from "./dto/login.dto";
import * as mongoose from "mongoose";
import { isValidEmail, isValidPassword } from "./utils/validate";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login({ email, password }: LoginDto) {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} was not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Incorrect password");
    }

    const payload = {
      id: user._id,
      email: user.email,
      onboarded: !!user.phone_number,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken, onboarded: payload.onboarded };
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      if (!isValidEmail(signUpDto.email)) {
        throw new BadRequestException("Invalid email format");
      }

      if (!isValidPassword(signUpDto.password)) {
        throw new BadRequestException(
          "Password must contain at least 8 characters, including uppercase, lowercase, number",
        );
      }

      const { email, first_name, last_name } = signUpDto;
      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new ConflictException("User already exists");
      }

      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const user = await User.create(
          [
            {
              email,
              first_name,
              last_name,
              password: hashedPassword,
            },
          ],
          { session },
        );

        await session.commitTransaction();

        const payload = {
          id: user[0]._id,
          email: user[0].email,
          onboarded: false,
        };

        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Error creating user");
    }
  }
}
