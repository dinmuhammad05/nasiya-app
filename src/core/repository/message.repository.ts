import { Repository } from 'typeorm';
import { Message } from '../entity/message.entity';

export type MessageRepository = Repository<Message>;
