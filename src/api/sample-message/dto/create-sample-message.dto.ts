import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSampleMessageDto {
  @ApiProperty({ example: 'Hello debtor', description: 'Message text' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 1, description: 'Store ID' })
  @IsUUID()
  @IsNotEmpty()
  storeId: string;
}
