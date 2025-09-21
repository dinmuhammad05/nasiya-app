import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Debt } from 'src/core/entity/debt.entity';
import type { DebtRepository } from 'src/core/repository/debt.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { DebtorService } from '../debtor/debtor.service';
import { IResponse } from 'src/common/interface/response.interface';

@Injectable()
export class DebtService extends BaseService<
  CreateDebtDto,
  UpdateDebtDto,
  Debt
> {
  constructor(
    @InjectRepository(Debt) private readonly debtRepo: DebtRepository,
    private readonly debtorService: DebtorService,
  ) {
    super(debtRepo);
  }

  async createDebt(dto: CreateDebtDto): Promise<IResponse> {
    await this.debtorService.findOneById(dto.debtorId);

    const created = this.debtRepo.create(dto);
    await this.debtRepo.save(created);
    return getSuccessRes(created, 201);
  }

  async update(id: string, dto: UpdateDebtDto): Promise<IResponse> {
    const found = await this.debtRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Debt not found');

    if (dto.debtorId) await this.debtorService.findOneById(dto.debtorId);

    await this.debtRepo.update(id, dto as any);
    const updated = await this.debtRepo.findOne({ where: { id } });
    return getSuccessRes(updated || {});
  }
}
