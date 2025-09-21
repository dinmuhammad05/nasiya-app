import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodDebt } from 'src/core/entity/periodDebt.entity';
import { PeriodDebtService } from './period-debt.service';
import { PeriodDebtController } from './period-debt.controller';
import { DebtModule } from '../debt/debt.module';

@Module({
  imports: [TypeOrmModule.forFeature([PeriodDebt]), DebtModule],
  controllers: [PeriodDebtController],
  providers: [PeriodDebtService],
  exports: [PeriodDebtService],
})
export class PeriodDebtModule {}
