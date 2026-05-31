import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Workspace name cannot be empty' })
  @MinLength(3, { message: 'Workspace name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Workspace name cannot exceed 50 characters' })
  name!: string;
}