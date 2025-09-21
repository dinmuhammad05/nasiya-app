import { Module } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { DebtorController } from './debtor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debtor } from 'src/core/entity/debtor.entity';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Debtor]), StoreModule],
  controllers: [DebtorController],
  providers: [DebtorService, CryptoService],
  exports: [DebtorService],
})
export class DebtorModule {}
