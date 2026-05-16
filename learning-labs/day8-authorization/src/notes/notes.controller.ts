import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Body() dto: CreateNoteDto,
    @Request() req: any
  ) {
    return this.notesService.create(
      dto.title,
      dto.content,
      req.user.id
    )
  }

  @Get()
  getMyNotes(@Request() req: any) {
    return this.notesService.getMyNotes(
      req.user.id
    )
  }

  @Delete(':id')
  deleteNote(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.notesService.deleteNote(
      id,
      req.user.id
    )
  }
}
