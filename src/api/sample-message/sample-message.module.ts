import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleMessage } from '../../core/entity/sampleMessage.entity';
import { SampleMessageService } from './sample-message.service';
import { SampleMessageController } from './sample-message.controller';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SampleMessage]), // SampleMessage repository
    StoreModule, // Store repository shu module orqali export qilinadi
  ],
  controllers: [SampleMessageController],
  providers: [SampleMessageService],
  exports: [SampleMessageService],
})
export class SampleMessageModule {}
