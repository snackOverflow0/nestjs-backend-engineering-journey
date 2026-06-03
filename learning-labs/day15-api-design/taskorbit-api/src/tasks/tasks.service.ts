import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // ➕ CREATE A TASK (WITH DEEP HIERARCHICAL OWNERSHIP CHECK)
  async create(userId: string, dto: CreateTaskDto) {
    // 1. Verify the project exists and traverse up to check workspace ownership
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: { workspace: true },
    });

    if (!project) {
      throw new NotFoundException('Targeted project not found');
    }

    if (project.workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to add tasks to this project');
    }

    // 2. Clear to create the task
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        projectId: dto.projectId,
      },
    });
  }

  // 📋 FIND ALL TASKS INSIDE A SPECIFIC PROJECT
  async findAllByProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: true },
    });

    if (!project || project.workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this project');
    }

    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔍 FIND A SINGLE TASK WITH OWNERSHIP VALIDATION
  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: { workspace: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.project.workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this task');
    }

    // Strip nested relations from response payload to keep it clean
    const { project, ...taskData } = task;
    return taskData;
  }

  // 🔄 UPDATE A TASK
  async update(userId: string, id: string, dto: UpdateTaskDto) {
    // Verify ownership first using our findOne method logic
    await this.findOne(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  // ❌ DELETE A TASK
  async remove(userId: string, id: string) {
    // Verify ownership first
    await this.findOne(userId, id);

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: 'Task successfully deleted' };
  }
}