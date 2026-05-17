import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('workouts')
export class WorkoutsController {
  constructor(
    private readonly workoutsService: WorkoutsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateWorkoutDto,
    @Req() req: any
  ) {
    return this.workoutsService.create(
      dto,
      req.user.id
    );
  }

  @UseGuards(JwtAuthGuard)  
  @Get()
  findAll(
    @Req() req: any,

    @Query('search')
    search?: string,

    @Query('page')
    page = 1,

    @Query('limit')
    limit = 10,

    @Query('sort')
    sort = 'desc'
  ) {
    return this.workoutsService.findAll(
      req.user.id
    );
  }

  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.workoutsService.remove(
      Number(id),
      req.user.id
    );
  }
}
