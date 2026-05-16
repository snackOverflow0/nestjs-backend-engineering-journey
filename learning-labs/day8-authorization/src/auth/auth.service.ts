import { 
  Injectable,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(
    email: string,
    password: string,
    name?: string
  ) {
    const existingUser =
      await this.usersService.findUserByEmail(email)

    if(existingUser) {
      throw new BadRequestException(
        'User already exists'
      )
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    return this.usersService.create(
      email,
      hashedPassword,
      name
    )
  }

  async login(
    email: string,
    password: string
  ) {
    const user =
      await this.usersService.findUserByEmail(email)

      if(!user) {
        throw new UnauthorizedException(
          'Invalid Credentials'
        )
      }

      const passwordMatches = 
        await bcrypt.compare(
          password,
          user.password
        )

      if(!passwordMatches) {
        throw new UnauthorizedException(
          'Invalid Credentials'
        )
      }

      const payload = {
        sub: user.id,
        email: user.email
      }

      return {
        access_token:
          await this.jwtService.signAsync(payload)
      }
  }
}
