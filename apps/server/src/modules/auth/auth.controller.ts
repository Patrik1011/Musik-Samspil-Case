import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import type { AuthService } from "./auth.service";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthEntity } from "./entity/auth.entity";
import type { LoginDto } from "./dto/login.dto";
import type { SignUpDto } from "./dto/signup.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("signup")
  @ApiCreatedResponse({ type: AuthEntity })
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
