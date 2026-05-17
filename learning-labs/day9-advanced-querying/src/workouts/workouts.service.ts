import { 
  Injectable,
  ForbiddenException
} from '@nestjs/common';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class WorkoutsService {
  constructor(
    private prisma: PrismaService
  ) {}

  create(
    dto: CreateWorkoutDto,

    userId: number
  ) {
    return this.prisma.workout.create({
      data: {
        ...dto,

        userId
      }
    })
  }

  findAll(
    userId: number,

    search?: string,

    page = 1,

    limit = 10,

    sort = 'desc',
  ) {
    const skip = 
      (page - 1) * limit

    return this.prisma.workout.findMany({
      where: {
        userId,
      
        ...(search && {
          title: {
            contains: search,

            mode: 'insensitive'
          }
        }),

      },
      
        orderBy: {
          createdAt: 
            sort === 'asc'
              ? 'asc'
              : 'desc',
        },
      

      skip,

      take: limit
    })
  }

  async remove(
    workoutId: number,

    userId: number
  ) {
    const workout =
      await this.prisma.workout.findUnique({
        where: {
          id: workoutId
        }
      })

    if (!workout) {
      throw new ForbiddenException(
        'Workout not found'
      )
    }

    if (workout.userId !== userId) {
      throw new ForbiddenException(
        'Not your workout'
      )
    }

    return this.prisma.workout.delete({
      where: {
        id: workoutId
      }
    })
  }
}
