import { Repository } from 'typeorm';
import { SampleMessage } from '../../core/entity/sampleMessage.entity';

export type SampleMessageRepository = Repository<SampleMessage>;
