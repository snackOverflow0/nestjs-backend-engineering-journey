import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  findAll() {
    return this.prismaService.note.findMany();
  }

  create(createNoteDto: CreateNoteDto) {
    return this.prismaService.note.create({
      data: createNoteDto,
    });
  }

  archive(id: number) {
    return this.prismaService.note.update({
      where: { id },

      data: {
        archived: true,
      },
    });
  }

  async remove(id: number) {
    await this.prismaService.note.delete({
      where: { id },
    });

    return {
      message: 'Note deleted',
    };
  }
}