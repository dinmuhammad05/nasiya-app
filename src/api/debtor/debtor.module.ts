import { Module } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { DebtorController } from './debtor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from 'src/core/entity/debtor.entity';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { StoreModule } from '../store/store.module';
import { Debt } from 'src/core/entity/debt.entity';
import { PhonesDebtor } from 'src/core/entity/phonesDebtor.entity';
import { PeriodDebt } from 'src/core/entity/periodDebt.entity';
import { FileService } from 'src/infrastructure/file/file.service';
import { ImagesDebt } from 'src/core/entity/imagesDebt.entity';
import { ImagesDebtor } from 'src/core/entity/imagesDebtor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Debtor, Debt, PhonesDebtor, PeriodDebt, ImagesDebt, ImagesDebtor]), StoreModule],
  controllers: [DebtorController],
  providers: [DebtorService, CryptoService, FileService],
  exports: [DebtorService],
})
export class DebtorModule {}
