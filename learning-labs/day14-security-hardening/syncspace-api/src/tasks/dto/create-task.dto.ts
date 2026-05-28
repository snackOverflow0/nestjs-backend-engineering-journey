import {
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  workspaceId!: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}