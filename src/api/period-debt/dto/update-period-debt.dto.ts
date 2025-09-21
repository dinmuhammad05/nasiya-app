import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodDebtDto } from './create-period-debt.dto';

export class UpdatePeriodDebtDto extends PartialType(CreatePeriodDebtDto) {}
