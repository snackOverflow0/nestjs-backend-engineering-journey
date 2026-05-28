import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  
  async register(dto: RegisterDto) {
    const existingUser = 
      await this.prisma.user.findUnique({
        where: { email: dto.email }
      })

    if (existingUser) {
      throw new ConflictException(
        'Email already registered'
      )
    }

    const hashedPassword = 
      await bcrypt.hash(
        dto.password,
        10
      )

    const user = 
      await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name
        }
      })

    return user
  }

  async login(dto: LoginDto) {
    const user = 
      await this.prisma.user.findUnique({
        where: { email: dto.email }
      })

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials'
      )
    }

    const isPasswordMatch = 
      await bcrypt.compare(
        dto.password,
        user.password
      )

    if (!isPasswordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials'
      )
    }

    const tokens = 
      await this.generateTokens(
        user.id,
        user.email
      )

    const hashedRefreshToken = 
      await bcrypt.hash(
        tokens.refreshToken,
        10
      )

    await this.prisma.user.update({
      where: { 
        id: user.id
       },

      data: {
        hashedRefreshToken
      }
    })

    return {
      tokens
    }
  }

  async refresh(refreshToken: string) {
    const payload = 
      await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_SECRET
        }
      )

    const user = 
      await this.prisma.user.findUnique({
        where: { 
          id: payload.sub
        }
      })

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException()
    }

    const refreshMatched = 
      await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken
      )

    if (!refreshMatched) {
      throw new UnauthorizedException()
    }

    const tokens = 
      await this.generateTokens(
        user.id,
        user.email
      )

    const newHashedRefreshToken = 
      await bcrypt.hash(
        tokens.refreshToken,
        10
      )

    await this.prisma.user.update({
      where: { 
        id: user.id
      },

      data: {
        hashedRefreshToken: 
          newHashedRefreshToken
      }
    })

    return tokens
  }

  async logout(
    userId: string
  ) {
    await this.prisma.user.update({
      where: {
        id: userId
      },
      
      data: {
        hashedRefreshToken: null
      }
    })

    return {
      message: 'Logged out'
    }

  }

  async generateTokens(
    userId: string,
    email: string
  ) {

    // Access token payload
    const payload = {
      sub: userId,
      email,
    }

    // Generate access token
    const accessToken = 
      await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '15m'
        }
      )

    // Generate refresh token
    const refreshToken = 
      await this.jwtService.signAsync(
        payload,
        {
          expiresIn: '7d'
        }
      )

    return {
      accessToken,
      refreshToken
    }
  }



}
