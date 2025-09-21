import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { DebtPeriod } from 'src/common/enum/debt.enum';

export class CreateDebtDto {
  @ApiProperty({
    example: 'iphone 17 jiggarangidan',
    description: 'Product name',
  })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: '2025-09-10', description: 'Debt date' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Payment period in months',
    enum: DebtPeriod,
    examples: {
      ONE: { value: 1, description: '1 oy' },
      THREE: { value: 3, description: '3 oy' },
      SIX: { value: 6, description: '6 oy' },
      TWELVE: { value: 12, description: '12 oy' },
    },
  })
  @IsEnum(DebtPeriod, { message: 'period must be one of: 1, 3, 6, 12' })
  @IsNotEmpty()
  period: DebtPeriod;

  @ApiProperty({ example: 1500.5, description: 'Total debt sum' })
  @IsNumber()
  @IsNotEmpty()
  sum: number;

  @ApiProperty({ example: 'Some description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'akljgi5783owkmldv', description: 'Debtor id' })
  @IsUUID()
  @IsNotEmpty()
  debtorId: string;
}
