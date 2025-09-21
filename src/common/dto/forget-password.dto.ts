import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPassDto {
  @ApiProperty({
    example: 'ssuhrobabdurazzoqov@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
