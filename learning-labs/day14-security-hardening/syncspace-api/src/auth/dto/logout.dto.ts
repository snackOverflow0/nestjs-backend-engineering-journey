import {
  IsString
} from 'class-validator'

export class RefreshDto {

  @IsString()
  RefreshToken!: string
}