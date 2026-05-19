import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(
    dto: CreateTaskDto,
    userId: number,
  ) {
    return this.prisma.task.create({
      data: {
        ...dto,
        userId
      }
    });
  }

  findAll(
    userId: number
  ) {
    return this.prisma.task.findMany({
      where: { userId }
    })
  }

  async findOne(
    id: number,
    userId: number
  ) {
      const task =
        await this.prisma.task.findUnique({
          where: { id }
        })

      if (!task) {
        throw new ForbiddenException(
          'Task not found'
        )
      }

      if (task.userId !== userId) {
        throw new ForbiddenException(
          'Access denied'
        )
      }

      return task
    }

  async update(
    id: number,
    dto: UpdateTaskDto,
    userId: number
  ) {
    await this.findOne(id, userId)

    return this.prisma.task.update({
      where: { id },

      data: dto
    })
  }

  async remove(
    id: number,
    userId: number
  ) {
    await this.findOne(id, userId)

    return this.prisma.task.delete({
      where: { id }
    })
  }
}
