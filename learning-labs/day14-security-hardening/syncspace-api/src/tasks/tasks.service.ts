import { Injectable } from '@nestjs/common';
import { GetTasksDto } from './dto/get-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/cache/redis.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async getTasks(
    query: GetTasksDto,
  ) {

    // Default values
    const page =
      Number(query.page) || 1;

    const limit =
      Number(query.limit) || 5;

    // Skip calculation
    const skip =
      (page - 1) * limit;

    // Search term
    const search =
      query.search || '';

    // Status filter
    const status =
      query.status;

    // Sort direction
    const sort =
      query.sort === 'asc'
        ? 'asc'
        : 'desc';

    const cacheKey = 
      `tasks:${JSON.stringify(query)}`

    // Check cache first
    const cachedTasks = 
      await this.redis.get(
        cacheKey
      )

    // Cache hits
    if (cachedTasks) {
      console.log('CACHE HIT')
      return JSON.parse(cachedTasks)
    }

    // Fetch tasks
    const tasks =
      await this.prisma.task.findMany({

        where: {

          // Search title
          title: {
            contains: search,
            mode: 'insensitive',
          },

          // Optional status filter
          ...(status && {
            status,
          }),
        },

        // Pagination
        skip,
        take: limit,

        // Sorting
        orderBy: {
          createdAt: sort,
        },
      });

    // Count total tasks
    const total =
      await this.prisma.task.count({

        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },

          ...(status && {
            status,
          }),
        },
      });

    const response =  {

      data: tasks,

      meta: {
        total,
        page,
        limit,
        totalPages:
          Math.ceil(total / limit),
      },
    };

    await this.redis.set(
      cacheKey,
      JSON.stringify(response),
      60
    )

    return response
  }

  async createTask(
    dto: CreateTaskDto
  ) {
    await this.prisma.task.create({
      data: {

        title: dto.title,

        description: dto.description,

        // Connect workspace relation
        workspace: {
          connect: {
            id: dto.workspaceId,
          },
        },

        // Optional assigned user
        ...(dto.assignedToId && {

          assignedTo: {
            connect: {
              id: dto.assignedToId,
            },
          },
        }),
      }
    })

    await this.redis.del(
      'tasks:{}'
    )
  }
}
