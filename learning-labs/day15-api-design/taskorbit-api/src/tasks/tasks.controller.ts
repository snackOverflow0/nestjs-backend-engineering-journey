import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard('jwt')) // 🛡️ Restricts entire task layer to authorized sessions
export class TaskController {
  constructor(private taskService: TaskService) {}

  // 📥 POST /tasks (Create a task inside a validated project)
  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateTaskDto) {
    return this.taskService.create(userId, dto);
  }

  // 📥 GET /tasks?projectId=XYZ (Fetch all tasks under an owned project)
  @Get()
  findAllByProject(
    @GetUser('id') userId: string,
    @Query('projectId') projectId: string,
  ) {
    return this.taskService.findAllByProject(userId, projectId);
  }

  // 📥 GET /tasks/:id (Fetch a single task details)
  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.taskService.findOne(userId, id);
  }

  // 🔄 PATCH /tasks/:id (Update selective task metadata fields)
  @Patch(':id')
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(userId, id, dto);
  }

  // ❌ DELETE /tasks/:id (Remove an item safely from a project)
  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.taskService.remove(userId, id);
  }
}