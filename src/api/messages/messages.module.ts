import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/core/entity/message.entity';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { SampleMessage } from 'src/core/entity/sampleMessage.entity';
import { Debtor } from 'src/core/entity/debtor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, SampleMessage, Debtor])],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessagesModule {}
