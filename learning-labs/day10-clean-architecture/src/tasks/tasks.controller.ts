import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateTaskDto } from './dto/create-task.dto';

import { UpdateTaskDto } from './dto/update-task.dto';

import { TasksService } from './tasks.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,

    @GetUser() user,
  ) {
    return this.tasksService.create(
      dto,

      user.id,
    );
  }

  @Get()
  findAll(@GetUser() user) {
    return this.tasksService.findAll(
      user.id,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,

    @GetUser() user,
  ) {
    return this.tasksService.findOne(
      id,

      user.id,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body() dto: UpdateTaskDto,

    @GetUser() user,
  ) {
    return this.tasksService.update(
      id,
      dto,
      user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,

    @GetUser() user,
  ) {
    return this.tasksService.remove(
      id,

      user.id,
    );
  }
}