import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(
    dto: RegisterDto
  ) {
    const existingUser =
      await this.usersService.findByEmail(dto.email)

    if (existingUser) {
      throw new ConflictException(
        'User already exists'
      )
    }

    const hashedPassword = 
      await bcrypt.hash(
        dto.password,
        10
      )

    const user = 
      await this.usersService.create({
        email: dto.email,

        password: hashedPassword,

        name: dto.name
      })

    return {
      message: 'User registered successfully',

      user
    }
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
      id: user.id,
      email: user.email
    }

    const access_token = 
      await this.jwtService.signAsync(payload)

    return {
      access_token
    }
  }
}
