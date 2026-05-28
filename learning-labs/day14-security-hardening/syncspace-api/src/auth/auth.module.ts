import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({

  imports: [
    UsersModule,

    // JWT configuration
    // token generation tools
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m'
      }
    })
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy
  ],
  
})
export class AuthModule {}
