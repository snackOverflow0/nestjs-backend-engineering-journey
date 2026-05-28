import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST/ auth/refresh
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.RefreshToken)
  }

  // POST/ auth/logout
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Req() req: any
  ) {
    return this.authService.logout(
      req.user.id
    )
  }

}
