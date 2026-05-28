import { 
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req
 } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  create(
    @Body() dto: CreateUserDto
  ) {
    return this.usersService.create(dto);
  }

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // GET /users/profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Req() req: any
  ) {
    return req.user
  }

  // GET /users/admin
  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles('ADMIN')
  @Get('admin')
  adminRoute() {
    return {
      message: 'Welcome Admin'
    }
  }
}
