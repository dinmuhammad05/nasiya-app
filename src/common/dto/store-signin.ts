import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StoreSignInDto {
  @ApiProperty({
    example: 'john17',
    description: 'users username',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'john1234',
    description: 'users password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
