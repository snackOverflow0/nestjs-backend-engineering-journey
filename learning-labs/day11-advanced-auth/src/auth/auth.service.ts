import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser =
      await this.usersService.findByEmail(dto.email)

     if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser(
      dto.email,
      hashedPassword,
    );

    return {
      message: 'User registered',
      user,
    };
  }

  async login(
    dto: LoginDto
  ) {
    const user = 
      await this.usersService.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials'
      )
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.password
    )

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid credentials'
      )
    }

    const payload = {
      sub: user.id,
      email: user.email
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m'
    })

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    })

    const hashedRefreshToken = 
      await bcrypt.hash(refreshToken, 10)

    await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    return {
      accessToken,
    };
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(
      userId,
      null,
    );

    return {
      message: 'Logged out successfully',
    };
  }
}


