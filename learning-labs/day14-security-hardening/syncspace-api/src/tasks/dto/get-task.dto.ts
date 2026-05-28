import {
  IsString,
  IsOptional,
  IsNumberString
} from 'class-validator'

import { TaskStatus } from '@prisma/client'

export class GetTasksDto {
  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  status?: TaskStatus

  @IsOptional()
  @IsString()
  sort?: string
}
