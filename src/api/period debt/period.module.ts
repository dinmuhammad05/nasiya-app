import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodDebt } from 'src/core/entity/periodDebt.entity';
import { DebtModule } from '../debt/debt.module';
import { PeriodDebtController } from './period.controller';
import { PeriodDebtService } from './period.service';

@Module({
  imports: [TypeOrmModule.forFeature([PeriodDebt]), DebtModule],
  controllers: [PeriodDebtController],
  providers: [PeriodDebtService],
  exports: [PeriodDebtService],
})
export class PeriodDebtModule {}