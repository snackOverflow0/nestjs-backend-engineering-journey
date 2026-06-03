import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString, IsEnum, MaxLength } from 'class-validator';

// Match our database Prisma schema enums exactly
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task title cannot be empty' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsEnum(TaskStatus, { message: 'Status must be either TODO, IN_PROGRESS, or DONE' })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Priority must be either LOW, MEDIUM, or HIGH' })
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString({}, { message: 'DueDate must be a valid ISO date string' })
  @IsOptional()
  dueDate?: string;

  @IsUUID('4', { message: 'Invalid Project ID format' })
  @IsNotEmpty({ message: 'Project ID is required to link this task' })
  projectId!: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}