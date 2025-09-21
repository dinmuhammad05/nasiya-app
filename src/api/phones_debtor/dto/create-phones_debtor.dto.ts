import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber,  IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePhonesDebtorDto {
  @ApiProperty({
    example: '+998901112233',
    description: 'Phone number of debtor',
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'uuid-of-debtor',
    description: 'Associated Debtor ID',
  })
  @IsUUID()
  @IsNotEmpty()
  debtorId: string;
}
