import { Module } from '@nestjs/common';
import { ImagesDebtService } from './images_debt.service';
import { ImagesDebtController } from './images_debt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesDebt } from 'src/core/entity/imagesDebt.entity';
import { FileService } from 'src/infrastructure/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesDebt])],
  controllers: [ImagesDebtController],
  providers: [ImagesDebtService, FileService],
})
export class ImagesDebtModule {}
