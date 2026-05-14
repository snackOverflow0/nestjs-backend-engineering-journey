import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateNoteDto } from './dto/create-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(
    private notesService: NotesService,
  ) {}

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.create(
      createNoteDto,
    );
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.notesService.archive(
      Number(id),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(
      Number(id),
    );
  }
}