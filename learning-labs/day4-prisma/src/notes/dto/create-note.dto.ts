import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(Priority)
  priority!: Priority;
}