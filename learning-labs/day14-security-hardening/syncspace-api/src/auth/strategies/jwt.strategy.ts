import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private prisma: PrismaService,
  ) {

    super({
      // Extract token from:
      // Authorization: Bearer TOKEN
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  // Runs AFTER token verification
  async validate(payload: any) {

    // Find user from token payload
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

    // User deleted?
    if (!user) {
      throw new UnauthorizedException();
    }

    // Attached to req.user
    return user;
  }
}