import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../../prisma/prisma.service";
import type { AuthEntity } from "./entity/auth.entity";
import type { SignUpDto } from "./dto/signup.dto";
import type { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email: ${email} was not found`);
    }

    if (!user.password) {
      throw new Error("User does not have a set password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Incorrect password");
    }

    const payload = {
      id: user.id,
      email: user.email,
      onboarded: !!(user.phone_number && user.instrument),
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthEntity> {
    const { email, first_name, last_name } = signUpDto;
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
      },
    });

    const accessToken = this.jwtService.sign({ userId: user.id });
    return { accessToken };
  }
}
