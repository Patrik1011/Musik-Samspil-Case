import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOkResponse } from "@nestjs/swagger";
import { AuthEntity } from "./entity/auth.entity";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    return this.authService.login(email, password);
  }
}
