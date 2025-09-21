import { Injectable } from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import type { DebtorRepository } from 'src/core/repository/debtor.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Debtor } from 'src/core/entity/debtor.entity';
import { StoreService } from '../store/store.service';
import { getSuccessRes } from 'src/common/util/get-success-res';

@Injectable()
export class DebtorService extends BaseService<
  CreateDebtorDto,
  UpdateDebtorDto,
  Debtor
> {
  constructor(
    @InjectRepository(Debtor) private readonly debtorRepo: DebtorRepository,
    private readonly storeService: StoreService,
  ) {
    super(debtorRepo);
  }
  async createDebtor(createDebtorDto: CreateDebtorDto) {
    const { storeId } = createDebtorDto;
    await this.storeService.findOneById(storeId);

    const store = this.debtorRepo.create(createDebtorDto);
    await this.debtorRepo.save(store);
    return getSuccessRes(store, 201);
  }

  async updateDebtor(id: string, updateDebtorDto: UpdateDebtorDto) {
    if (updateDebtorDto.storeId) {
      await this.storeService.findOneById(updateDebtorDto.storeId);
    }

    return this.getRepository.update(id, updateDebtorDto);
  }
}
