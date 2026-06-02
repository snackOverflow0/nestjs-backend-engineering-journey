import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name cannot be empty' })
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Project name cannot exceed 50 characters' })
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Description cannot exceed 200 characters' })
  description?: string;

  @IsUUID('4', { message: 'Invalid Workspace ID format' })
  @IsNotEmpty({ message: 'Workspace ID is required to link this project' })
  workspaceId!: string;
}