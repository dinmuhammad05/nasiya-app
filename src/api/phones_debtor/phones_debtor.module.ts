import { Module } from '@nestjs/common';
import { PhonesDebtorService } from './phones_debtor.service';
import { PhonesDebtorController } from './phones_debtor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtorModule } from '../debtor/debtor.module';
import { PhonesDebtor } from 'src/core/entity/phonesDebtor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhonesDebtor]), DebtorModule],
  controllers: [PhonesDebtorController],
  providers: [PhonesDebtorService],
})
export class PhonesDebtorModule {}
