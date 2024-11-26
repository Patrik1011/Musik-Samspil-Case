import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../../schemas/user.schema";
import type { SignUpDto } from "./dto/signup.dto";
import type { LoginDto } from "./dto/login.dto";

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
      onboarded: !!(user.phone_number && user.instrument),
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken, onboarded: payload.onboarded };
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, first_name, last_name } = signUpDto;
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await User.create({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });

    const payload = {
      id: user._id,
      email: user.email,
      onboarded: false,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
