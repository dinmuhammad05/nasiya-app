import { PartialType } from '@nestjs/mapped-types';
import { CreateSampleMessageDto } from './create-sample-message.dto';

export class UpdateSampleMessageDto extends PartialType(
  CreateSampleMessageDto,
) {}
