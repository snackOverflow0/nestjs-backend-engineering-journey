import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService
  ) {}

  create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        ownerId: userId
      }
    })
  }

  findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        ownerId: userId
      }
    })
  }

  async findOne(userId: string, id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id }
    })

    if (!workspace) throw new NotFoundException('Workspace not found')

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to access this workspace')
    }

    return workspace
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
