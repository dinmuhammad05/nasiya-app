import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDebtorDto {
  @ApiProperty({ example: '1', description: "store's id" })
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ example: 'eshmat toshmatov', description: 'qarzdorni ismi' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Chilonzor', description: 'store address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'bu qarzdor bizdan iphon17 olib ketdi!!!' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  isAvtive: boolean;
}
