import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Payment } from 'src/core/entity/payment.entity';
import type { PaymentRepository } from 'src/core/repository/payment.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { PeriodDebtService } from '../period-debt/period-debt.service';
import { Debt } from 'src/core/entity/debt.entity';
import { PeriodDebt } from 'src/core/entity/periodDebt.entity';
import { DataSource } from 'typeorm';
import { IResponse } from 'src/common/interface/response.interface';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  UpdatePaymentDto,
  Payment
> {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: PaymentRepository,
    private readonly periodService: PeriodDebtService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super(paymentRepo);
  }

  async create(dto: CreatePaymentDto): Promise<IResponse> {
    const period = await this.periodService.findOneById(dto.periodDebtId);

    if (!period) throw new NotFoundException('Period not found');

    const result = await this.dataSource.transaction(async (manager) => {
      const paymentRepo = manager.getRepository(Payment);
      const periodRepo = manager.getRepository(PeriodDebt);
      const debtRepo = manager.getRepository(Debt);

      const payment = paymentRepo.create(dto as any);
      await paymentRepo.save(payment);

      const periodEntity = await periodRepo.findOne({
        where: { id: dto.periodDebtId },
        relations: ['debt'],
      });
      if (!periodEntity)
        throw new NotFoundException('Period debt not found inside transaction');

      const debtEntity = await debtRepo.findOne({
        where: { id: periodEntity.debt.id },
        relations: ['periods'],
      });
      if (!debtEntity) throw new NotFoundException('Debt not found');

      let balance = Number(debtEntity.balance || 0);
      let sum = Number(dto.sum);

      sum += balance;
      debtEntity.balance = 0;

      const currentRemnant = Number(periodEntity.remnant ?? 0);

      if (sum >= currentRemnant) {
        periodEntity.remnant = 0;
        periodEntity.isPaid = true;

        const extra = sum - currentRemnant;
        if (extra > 0) {
          debtEntity.balance += extra;
        }
      } else {
        periodEntity.remnant = currentRemnant - sum;
      }

      await periodRepo.save(periodEntity);
      await debtRepo.save(debtEntity);

      const totalPeriods = debtEntity.periods.length;
      const paidPeriods = debtEntity.periods.filter((p) => p.isPaid).length;
      const remainingPeriods = totalPeriods - paidPeriods;

      return {
        payment,
        periodEntity,
        debtEntity: {
          id: debtEntity.id,
          product: debtEntity.product,
          balance: debtEntity.balance,
          totalPeriods,
          paidPeriods,
          remainingPeriods,
        },
      };
    });

    return getSuccessRes(result, 201);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<IResponse> {
    const found = await this.paymentRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Payment not found');

    await this.paymentRepo.update(id, dto as any);
    const updated = await this.paymentRepo.findOne({ where: { id } });
    return getSuccessRes(updated || {});
  }
}
