import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { AccessRoles } from 'src/common/enum/roles.enum';

export class CreateStoreDto {
  @ApiProperty({ example: 'login123!', description: 'password for store' })
  @IsString()
  @Length(6, 255)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'sotuvchi sotucvchiyev',
    description: 'fullName for store',
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of store owner',
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 0, description: 'Initial wallet balance' })
  @IsNumber()
  @IsNotEmpty()
  wallet?: number;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @ApiProperty({ example: 'STORE', description: "store's role" })
  @IsEnum(AccessRoles)
  @IsNotEmpty()
  role: AccessRoles.STORE;

  @ApiProperty({
    example: 'ssuhrobabdurazzoqov@gmail.com',
    description: 'email for store',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
