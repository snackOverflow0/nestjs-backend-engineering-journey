import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      // Pull the token out of the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string
    })
  }

  // If the token signature is valid, NestJS passes the decoded payload here
  async validate(payload: { sub: string, email: string, role: string }) {
      // Verify the user actually still exists in our database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      })
      if (!user) throw new UnauthorizedException('User account no longer exists')

      // Whatever we return here gets automatically attached to req.user
      return {
        id: user.id,
        email: user.email,
        role: user.role
      }
  }
}