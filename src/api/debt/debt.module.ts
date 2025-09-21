import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from 'src/core/entity/debt.entity';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { DebtorModule } from '../debtor/debtor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Debt]), DebtorModule],
  controllers: [DebtController],
  providers: [DebtService],
  exports: [DebtService],
})
export class DebtModule {}
