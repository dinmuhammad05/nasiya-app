import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryPaginationDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Suhrob',
    description: 'Query for searching',
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    description: 'Page number (starting from 1)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description: 'Limit of data per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
