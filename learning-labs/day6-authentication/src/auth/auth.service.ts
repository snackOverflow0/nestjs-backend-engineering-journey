import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(name: string, email: string, password: string) {
    const existingUser =
      await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    return this.usersService.create(
      name,
      email,
      hashedPassword,
    );
  }
}