import { PartialType } from '@nestjs/mapped-types';
import { CreatePhonesDebtorDto } from './create-phones_debtor.dto';

export class UpdatePhonesDebtorDto extends PartialType(CreatePhonesDebtorDto) {}
