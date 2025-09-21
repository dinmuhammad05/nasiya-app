import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateImagesDebtorDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Debtor images',
  })
  files: Express.Multer.File[];

  @ApiProperty({ example: 1, description: 'Debtor ID' })
  @IsUUID()
  @IsNotEmpty()
  debtorId: string;
}
