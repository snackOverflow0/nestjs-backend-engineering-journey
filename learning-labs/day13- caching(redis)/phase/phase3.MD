PHASE 3 — AUTHENTICATION SYSTEM

Now we build:

production authentication architecture

This is one of the MOST important backend skills.

You are now building:

access tokens
refresh tokens
protected routes
session lifecycle

This is:

real-world authentication
FINAL AUTH FEATURES

✔ Register
✔ Login
✔ JWT access token
✔ Refresh token
✔ Logout
✔ JwtGuard
✔ Protected routes

AUTH FLOW
Login
↓
Generate access token
↓
Generate refresh token
↓
Store hashed refresh token
↓
Return tokens
HUGE SECURITY CONCEPT

We NEVER store:

raw refresh tokens

We store:

hashed refresh tokens

Exactly like passwords.

STEP 1 — CREATE DTOS

Inside:

src/auth/dto

Create:

register.dto.ts
login.dto.ts
register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()

  @MinLength(6)
  password: string;
}
login.dto.ts
import {
  IsEmail,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
STEP 2 — CONFIGURE JWT MODULE

Open:

src/auth/auth.module.ts

Replace with:

import { Module }
from '@nestjs/common';

import { JwtModule }
from '@nestjs/jwt';

import { AuthController }
from './auth.controller';

import { AuthService }
from './auth.service';

import { PrismaModule }
from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,

    JwtModule.register({
      secret:
        process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
  ],
})

export class AuthModule {}
HUGE CONCEPT
Access Token Expiration
expiresIn: '15m'

Short-lived:

safer authentication
STEP 3 — CREATE AUTH SERVICE

Open:

src/auth/auth.service.ts

Replace EVERYTHING.

FULL AUTH SERVICE
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

import { JwtService }
from '@nestjs/jwt';

import * as bcrypt
from 'bcrypt';

import { RegisterDto }
from './dto/register.dto';

import { LoginDto }
from './dto/login.dto';

@Injectable()

export class AuthService {
  constructor(
    private prisma: PrismaService,

    private jwtService:
      JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ) {
    const hashedPassword =
      await bcrypt.hash(
        dto.password,
        10,
      );

    const user =
      await this.prisma.user
        .create({
          data: {
            email:
              dto.email,

            password:
              hashedPassword,
          },
        });

    return user;
  }

  async login(
    dto: LoginDto,
  ) {
    const user =
      await this.prisma.user
        .findUnique({
          where: {
            email:
              dto.email,
          },
        });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken =
      await this.jwtService
        .signAsync(payload);

    const refreshToken =
      await this.jwtService
        .signAsync(payload, {
          expiresIn: '7d',
        });

    const hashedRefreshToken =
      await bcrypt.hash(
        refreshToken,
        10,
      );

    await this.prisma.user
      .update({
        where: {
          id: user.id,
        },

        data: {
          hashedRefreshToken,
        },
      });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    userId: number,
    refreshToken: string,
  ) {
    const user =
      await this.prisma.user
        .findUnique({
          where: {
            id: userId,
          },
        });

    if (
      !user ||
      !user.hashedRefreshToken
    ) {
      throw new UnauthorizedException();
    }

    const refreshMatches =
      await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

    if (!refreshMatches) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken =
      await this.jwtService
        .signAsync(payload);

    return {
      accessToken,
    };
  }

  async logout(userId: number) {
    await this.prisma.user
      .update({
        where: {
          id: userId,
        },

        data: {
          hashedRefreshToken:
            null,
        },
      });

    return {
      message:
        'Logged out successfully',
    };
  }
}
HUGE CONCEPTS
Password Hashing
bcrypt.hash()
Token Comparison
bcrypt.compare()
Refresh Token Persistence
stored in database
STEP 4 — CREATE AUTH CONTROLLER

Open:

src/auth/auth.controller.ts

Replace with:

import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService }
from './auth.service';

import { RegisterDto }
from './dto/register.dto';

import { LoginDto }
from './dto/login.dto';

@Controller('auth')

export class AuthController {
  constructor(
    private authService:
      AuthService,
  ) {}

  @Post('register')

  register(
    @Body()
    dto: RegisterDto,
  ) {
    return this.authService
      .register(dto);
  }

  @Post('login')

  login(
    @Body()
    dto: LoginDto,
  ) {
    return this.authService
      .login(dto);
  }

  @Post('refresh')

  refresh(
    @Body()
    body: {
      userId: number;

      refreshToken: string;
    },
  ) {
    return this.authService
      .refresh(
        body.userId,
        body.refreshToken,
      );
  }

  @Post('logout')

  logout(
    @Body()
    body: {
      userId: number;
    },
  ) {
    return this.authService
      .logout(body.userId);
  }
}
STEP 5 — CREATE JWT STRATEGY

Generate:

nest g class auth/strategy/jwt.strategy --no-spec
jwt.strategy.ts
import {
  Injectable,
} from '@nestjs/common';

import { PassportStrategy }
from '@nestjs/passport';

import { Strategy,
ExtractJwt }
from 'passport-jwt';

@Injectable()

export class JwtStrategy
extends PassportStrategy(
  Strategy,
) {
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt
          .fromAuthHeaderAsBearerToken(),

      ignoreExpiration:
        false,

      secretOrKey:
        process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
STEP 6 — REGISTER STRATEGY

Open:

src/auth/auth.module.ts

Import:

import { JwtStrategy }
from './strategy/jwt.strategy';

Add to providers:

JwtStrategy
FINAL providers
providers: [
  AuthService,
  JwtStrategy,
]
STEP 7 — CREATE JWT GUARD

Generate:

nest g guard auth/guard/jwt --no-spec
jwt.guard.ts

Replace with:

import {
  Injectable,
} from '@nestjs/common';

import { AuthGuard }
from '@nestjs/passport';

@Injectable()

export class JwtGuard
extends AuthGuard('jwt') {}
STEP 8 — TEST REGISTER
POST /auth/register

Body:

{
  "email": "admin@test.com",
  "password": "password123"
}
STEP 9 — TEST LOGIN
POST /auth/login

Body:

{
  "email": "admin@test.com",
  "password": "password123"
}

Expected:

{
  "accessToken": "...",
  "refreshToken": "..."
}
STEP 10 — TEST REFRESH
POST /auth/refresh

Body:

{
  "userId": 1,
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
STEP 11 — TEST LOGOUT
POST /auth/logout

Body:

{
  "userId": 1
}
HUGE CONCEPTS YOU JUST LEARNED
Access Tokens

Short-lived auth.

Refresh Tokens

Long-lived session renewal.

Session Lifecycle
login
refresh
logout
Enterprise Auth

This is:

real production auth architecture
PHASE 3 COMPLETE WHEN:

✔ register works
✔ login works
✔ access token generated
✔ refresh token generated
✔ refresh endpoint works
✔ logout invalidates refresh token
✔ JwtStrategy works
✔ JwtGuard created