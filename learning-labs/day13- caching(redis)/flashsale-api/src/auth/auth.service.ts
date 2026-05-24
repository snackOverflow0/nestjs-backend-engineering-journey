import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register (
    dto: RegisterDto
  ) {
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
          password: hashedPassword
        }
      })

    return user
  }

  async login (
    dto: LoginDto
  ) {
    const user =  
      await this.prisma.user.findUnique({
        where: { email: dto.email }
      })

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials'
      )
    }

    const passwordMatches =  
      await bcrypt.compare(
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

    const accessToken = 
      await this.jwt.signAsync(payload)

    const refreshToken =
      await this.jwt.signAsync(payload, {
        expiresIn: '7d'
      })

    const hashedRefreshToken =
      await bcrypt.hash(
        refreshToken,
        10
      )

    await this.prisma.user.update({
      where: { id: user.id },

      data: { hashedRefreshToken }
    })

    return {
      accessToken,
      refreshToken
    }
  }

  async refresh(
    userId: number,
    refreshToken: string
  ) {
    const user =  
      await this.prisma.user.findUnique({
        where: { id: userId }
      })

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException()
    }

    const refreshMatches =
      await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken
      )

    if (!refreshMatches) {
      throw new UnauthorizedException()
    }

    const payload = {
      sub: user.id,
      email: user.email
    }

    const accessToken = 
      await this.jwt.signAsync(payload)

    return {
      accessToken
    }
  }

  async logout(
    userId: number
  ) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken: null
      }
    })

    return {
      message: "Logged out successfully"
    }
  }
}
