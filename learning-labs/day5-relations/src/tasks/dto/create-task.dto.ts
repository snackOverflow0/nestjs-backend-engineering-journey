import { 
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsInt,
 } from "class-validator";

export class CreateTaskDto {

  @IsString()
  @IsNotEmpty()
  title!: string

  @IsInt()
  projectId!: number
}
