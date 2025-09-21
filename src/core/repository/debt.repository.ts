import { Repository } from 'typeorm';
import { Debt } from '../entity/debt.entity';

export type DebtRepository = Repository<Debt>;
