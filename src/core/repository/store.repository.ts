import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';

export type StoreRepository = Repository<Store>;
