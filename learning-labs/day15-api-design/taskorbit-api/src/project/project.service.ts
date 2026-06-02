import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // ➕ CREATE A PROJECT (WITH HIERARCHICAL OWNERSHIP CHECK)
  async create(userId: string, dto: CreateProjectDto) {
    // 1. Verify the targeted workspace exists and belongs to the logged-in user
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: dto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Targeted workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to create a project in this workspace');
    }

    // 2. Safe to create since ownership is verified
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        workspaceId: dto.workspaceId,
      },
    });
  }

  // 📋 FIND ALL PROJECTS INSIDE A SPECIFIC WORKSPACE
  async findAllByWorkspace(userId: string, workspaceId: string) {
    // Verify workspace access rights first
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this workspace');
    }

    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }

  // 🔍 FIND A SINGLE PROJECT WITH DEEP OWNERSHIP CHECK
  async findOne(userId: string, id: string) {
    // Fetch the project and include its parent workspace in a single query
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { workspace: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Confirm the parent workspace is owned by the user
    if (project.workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this project');
    }

    // Clean up the response so we don't leak extra parent metadata unless needed
    const { workspace, ...projectData } = project;
    return projectData;
  }
}