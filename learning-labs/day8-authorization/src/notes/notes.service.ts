import { 
  Injectable,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  create(
    title: string,
    content: string,
    userId: number
  ) {
    return this.prisma.note.create({
      data: {
        title,
        content,
        userId
      }
    })
  }

  getMyNotes(
    userId: number
  ) {
    return this.prisma.note.findMany({
      where: {
        userId
      }
    })
  }

  async deleteNote(
    noteId: number,
    userId: number
  ) {
    const note =
      await this.prisma.note.findUnique({
        where: { 
          id: noteId
         }
      })

    if(!note) {
      throw new NotFoundException(
        'Note not found'
      )
    }

    if(note.userId !== userId) {
      throw new ForbiddenException(
        'Not your note'
      )
    }

    return this.prisma.note.delete({
      where: {
        id: noteId
      }
    })
  }
}
