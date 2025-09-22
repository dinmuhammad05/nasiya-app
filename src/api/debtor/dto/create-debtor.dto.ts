import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DebtPeriod } from 'src/common/enum/debt.enum';

export class CreateDebtorDto {
  @ApiProperty({ example: '1', description: "store's id" })
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ example: 'eshmat toshmatov', description: 'qarzdorni ismi' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Chilonzor', description: 'qarzdor manzili' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'Faollik holati' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({
    example: 'iPhone 17 jiggarangidan',
    description: 'Mahsulot nomi',
  })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: '2025-09-10', description: 'Qarz olingan sana' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'To`lov muddati (oylarda)',
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

  @ApiProperty({ example: 1500.5, description: 'Umumiy qarz summasi' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  sum: number;

  @ApiPropertyOptional({ example: 'Some description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150.0, description: 'Oylik to`lov summasi' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  monthlySum: number;

  @ApiProperty({ example: false, description: 'Qarz yopilganmi' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPaid?: boolean;

  @ApiPropertyOptional({
    example: 1200.0,
    description: 'Qarzdan qolgan summa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  remnant?: number;

  @ApiProperty({
    example: '+998901112233',
    description: 'Qarzdor telefon raqami',
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phoneNumber: string;
}
