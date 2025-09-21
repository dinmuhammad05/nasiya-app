import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/enum/roles.enum';

export class CreateAdminDto {
  @ApiProperty({
    example: 'eshmat1',
    description: 'Unique username for admin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Eshmat123!',
    description:
      'Password for admin (must contain uppercase, lowercase, number, and special character)',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: true,
    description: 'Status of admin (active or not)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    enum: AccessRoles,
    example: AccessRoles.SUPER_ADMIN,
    description: 'Role of the admin',
    required: false,
  })
  @IsEnum(AccessRoles)
  @IsOptional()
  role?: AccessRoles;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'email for user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
