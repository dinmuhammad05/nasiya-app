import { ApiProperty } from '@nestjs/swagger';
import strict from 'assert/strict';
import { IsString, IsNotEmpty, IsUrl, IsNumber, IsUUID } from 'class-validator';

export class CreateImagesDebtDto {
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({
    example: 'debt id for debt',
    description: 'Associated Debt ID',
  })
  @IsUUID()
  @IsNotEmpty()
  debtId: string;
}
