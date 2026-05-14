import { Injectable } from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProjectDto) {
    return this.prisma.project.create({
      data,
    })
  }

  findAll() {
    return this.prisma.project.findMany({
      include: {
        tasks: true
      }
    })
  }

}
