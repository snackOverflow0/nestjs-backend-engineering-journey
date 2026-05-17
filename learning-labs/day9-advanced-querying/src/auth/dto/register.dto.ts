import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional
} from "class-validator"

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string
}