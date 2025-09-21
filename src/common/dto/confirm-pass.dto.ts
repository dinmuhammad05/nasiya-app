import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ConfirmForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsEmail({}, { message: 'Email noto‘g‘ri formatda kiritilgan' })
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Yangi parol',
  })
  @IsString()
  @IsNotEmpty({ message: 'Parol bo‘sh bo‘lishi mumkin emas' })
  @IsStrongPassword(
    {},
    {
      message:
        'Parol kuchsiz. U katta harf, kichik harf, raqam va maxsus belgi o‘z ichiga olishi kerak',
    },
  )
  newPassword: string;
}
