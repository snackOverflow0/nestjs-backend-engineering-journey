import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('workspace')
@UseGuards(AuthGuard('jwt'))
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // POST /workspaces (Create a workspace)
  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspaceService.create(userId, dto);
  }

  // GET /workspaces (Get all workspaces belonging to me)
  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.workspaceService.findAll(userId);
  }

  // GET /workspaces/:id (Get one specific workspace by its ID)
  @Get(':id')
  findOne(@GetUser('id') userId: string ,@Param('id') id: string) {
    return this.workspaceService.findOne(userId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
