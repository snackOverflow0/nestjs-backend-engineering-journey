import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2'
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check if the email is already in use
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })
    if (existingUser) throw new ConflictException('This email is already registered') 

    // 2. Hash the raw password securely using Argon2
    const hashedPassword = await argon2.hash(dto.password)

    // 3. Save the new user record into PostgreSQL
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password
      }
    })

    // 4. Return a signed token for immediate login
    return this.generateToken(user.id, user.email, user.role)
  }

  async login(dto: LoginDto) {
    // 1. Fetch user by their email address
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (!user) throw new UnauthorizedException('Invalid email or password credentials')

    // 2. Verify if the incoming password matches our database hash
    const isPasswordValid = await argon2.verify(user.password, dto.password)
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password credentials')

    // 3. Issue and return the signed access token
    return this.generateToken(user.id, user.email, user.role)
  }

  // HELPER: SIGN TOKEN PAYLOAD
  async generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET
      })
    }
  }
}
