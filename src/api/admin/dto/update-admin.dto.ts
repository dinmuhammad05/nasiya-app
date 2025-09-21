import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Status of admin',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
