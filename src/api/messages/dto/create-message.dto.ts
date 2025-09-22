import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { MessageStatus } from 'src/common/enum/message.enum';

export class CreateMessageDto {
  @ApiProperty({ example: 1, required: false })
  @IsUUID()
  @IsOptional()
  sampleMessageId?: string;

  @ApiProperty({ example: 5 })
  @IsUUID()
  @IsNotEmpty()
  debtorId: string;

  @ApiProperty({ enum: MessageStatus, default: MessageStatus.PENDING })
  @IsEnum(MessageStatus)
  @IsOptional()
  status?: MessageStatus;
}
