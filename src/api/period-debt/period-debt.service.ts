import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodDebt } from 'src/core/entity/periodDebt.entity';
import type { PeriodDebtRepository } from 'src/core/repository/period-debt.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreatePeriodDebtDto } from './dto/create-period-debt.dto';
import { UpdatePeriodDebtDto } from './dto/update-period-debt.dto';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { DebtService } from '../debt/debt.service';
import { IResponse } from 'src/common/interface/response.interface';

@Injectable()
export class PeriodDebtService extends BaseService<
  CreatePeriodDebtDto,
  UpdatePeriodDebtDto,
  PeriodDebt
> {
  constructor(
    @InjectRepository(PeriodDebt)
    private readonly periodRepo: PeriodDebtRepository,
    private readonly debtService: DebtService,
  ) {
    super(periodRepo);
  }

  async create(dto: CreatePeriodDebtDto): Promise<IResponse> {
    await this.debtService.findOneById(dto.debtId);

    const entity = this.periodRepo.create(dto as any);
    await this.periodRepo.save(entity);
    return getSuccessRes(entity, 201);
  }

  async update(id: string, dto: UpdatePeriodDebtDto): Promise<IResponse> {
    const found = await this.periodRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Period debt not found');

    if (dto.debtId) await this.debtService.findOneById(dto.debtId);

    await this.periodRepo.update(id, dto as any);
    const updated = await this.periodRepo.findOne({ where: { id } });
    return getSuccessRes(updated || {});
  }
}
