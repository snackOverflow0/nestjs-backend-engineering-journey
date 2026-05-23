import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where : { email: dto.email }
    })

    if (existingUser) throw new ForbiddenException('Email already registered')

    const hash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hash
      }
    })

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refresh_token)

    return tokens
  }

  // LOGIN
  async login (dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (!user) throw new ForbiddenException('Invalid credentials')

    const match = await bcrypt.compare(dto.password, user.password)
    if (!match) throw new ForbiddenException('Invalid credentials')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refresh_token)

    return tokens
  }

  // REFRESH TOKEN
  async refreshToken(userId: number, refresh_token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied')

    const match = await bcrypt.compare(refresh_token, user.refreshToken)
    if (!match) throw new ForbiddenException('Invalid refresh token')

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refresh_token)

    return tokens
  }

  // LOGOUT
  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    })

    return { message: 'Logged out' }
  }

  // TOKEN HELPERS
  async updateRefreshToken(userId: number, token: string) {
    const hash = await bcrypt.hash(token, 10)

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash }
    })
  }

  async getTokens(userId: number, email: string) {
    const access_token = await this.jwt.signAsync(
      { sub: userId, email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' }
    )

    const refresh_token = await this.jwt.signAsync(
      { sub: userId, email },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    )

    return {
      access_token,
      refresh_token
    }
  }
}
