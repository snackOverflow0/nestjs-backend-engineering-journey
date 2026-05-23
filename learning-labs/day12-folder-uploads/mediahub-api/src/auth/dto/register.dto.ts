import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty
} from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string
}