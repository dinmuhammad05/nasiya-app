import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreatePeriodDebtDto {
  @ApiProperty({ example: 150.0, description: 'Monthly payment sum' })
  @IsNumber()
  @IsNotEmpty()
  monthlySum: number;

  @ApiProperty({ example: false, description: 'Is paid' })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({ example: '2025-09-10', description: 'Date of the period' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: 1200.0,
    description: 'Remnant of debt after payments',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  remnant?: number;

  @ApiProperty({ example: 'uuid-of-debt', description: 'Debt id' })
  @IsUUID()
  @IsNotEmpty()
  debtId: string;
}
