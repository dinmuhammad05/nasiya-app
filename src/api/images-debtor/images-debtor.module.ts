import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesDebtor } from '../../core/entity/imagesDebtor.entity';
import { ImagesDebtorService } from './images-debtor.service';
import { ImagesDebtorController } from './images-debtor.controller';
import { Debtor } from 'src/core/entity/debtor.entity';
import { FileService } from 'src/infrastructure/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesDebtor, Debtor])],
  controllers: [ImagesDebtorController],
  providers: [ImagesDebtorService, FileService],
  exports: [ImagesDebtorService],
})
export class ImagesDebtorModule {}
