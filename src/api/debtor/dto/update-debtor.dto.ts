import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtorDto } from './create-debtor.dto';

export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {}
