import {
  IsInt,
  IsNumber,
  IsString,
  Min
} from 'class-validator'

export class CreateProductDto {
  @IsString()
  name!: string

  @IsString()
  description!: string

  @IsNumber()
  @Min(1)
  price!: number

  @IsInt()
  stock!: number
}
