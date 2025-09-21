import { Repository } from 'typeorm';
import { PeriodDebt } from '../entity/periodDebt.entity';

export type PeriodDebtRepository = Repository<PeriodDebt>;
