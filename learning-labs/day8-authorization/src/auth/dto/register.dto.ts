import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  MinLength
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
  @IsOptional()
  @IsNotEmpty()
  name?: string

}