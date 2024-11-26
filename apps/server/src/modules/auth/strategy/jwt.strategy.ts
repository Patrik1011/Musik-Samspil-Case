import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

interface JwtPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly usersService: UsersService) {
    console.log("JWT_SECRET", process.env.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "",
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
