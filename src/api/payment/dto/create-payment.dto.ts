import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 150.0, description: 'Paid sum' })
  @IsUUID()
  @IsNotEmpty()
  sum: string;

  @ApiProperty({ example: '2025-09-12', description: 'Payment date' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: 'period debt id',
    description: 'Period debt id',
  })
  @IsUUID()
  @IsNotEmpty()
  periodDebtId: string;
}
