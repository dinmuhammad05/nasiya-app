import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodDebtDto } from './create-period.dto';

export class UpdatePeriodDebtDto extends PartialType(CreatePeriodDebtDto) {}