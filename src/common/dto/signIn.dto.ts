import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'john17',
    description: 'users username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'John1234!',
    description: 'users password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
