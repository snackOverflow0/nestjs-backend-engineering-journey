import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('projects')
@UseGuards(AuthGuard('jwt')) // Protects all project channels from unauthorized access
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // POST /projects (Create a project inside a validated workspace)
  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectService.create(userId, dto);
  }

  // GET /projects?workspaceId=XYZ (Fetch projects for a specific workspace container)
  @Get()
  findAllByWorkspace(
    @GetUser('id') userId: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    return this.projectService.findAllByWorkspace(userId, workspaceId);
  }

  // GET /projects/:id (Fetch a single project with nested ownership validation)
  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.projectService.findOne(userId, id);
  }
}