import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import type { DebtorRepository } from 'src/core/repository/debtor.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Debtor } from 'src/core/entity/debtor.entity';
import { StoreService } from '../store/store.service';
import { DataSource } from 'typeorm';
import { Debt } from 'src/core/entity/debt.entity';
import { DebtRepository } from 'src/core/repository/debt.repository';
import { DebtPeriod } from 'src/common/enum/debt.enum';
import { PeriodDebt } from 'src/core/entity/periodDebt.entity';
import { PeriodDebtRepository } from 'src/core/repository/period-debt.repository';
import { PhonesDebtor } from 'src/core/entity/phonesDebtor.entity';
import { PhonesDebtorRepository } from 'src/core/repository/phone-debtor.repository';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { FileService } from 'src/infrastructure/file/file.service';
import { ImagesDebt } from 'src/core/entity/imagesDebt.entity';
import { ImagesDebtRepository } from 'src/core/repository/image-debt.repository';
import { ImagesDebtor } from 'src/core/entity/imagesDebtor.entity';

@Injectable()
export class DebtorService extends BaseService<
  CreateDebtorDto,
  UpdateDebtorDto,
  Debtor
> {
  constructor(
    @InjectRepository(Debtor) private readonly debtorRepo: DebtorRepository,
    @InjectRepository(Debt) private readonly debtRepo: DebtRepository,
    @InjectRepository(PeriodDebt)
    private readonly periodDebt: PeriodDebtRepository,
    @InjectRepository(PhonesDebtor)
    private readonly phonesDebtor: PhonesDebtorRepository,
    @InjectRepository(ImagesDebt)
    private readonly imagesDebtRepo: ImagesDebtRepository,
    private readonly storeService: StoreService,
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
  ) {
    super(debtorRepo);
  }
  async createDebtor(
  createDebtorDto: CreateDebtorDto,
  imageDebt: Express.Multer.File,
  imageDebtor: Express.Multer.File,
) {
  return this.dataSource.transaction(async (manager) => {
    const debtor = manager.create(Debtor, {
      fullName: createDebtorDto.fullName,
      address: createDebtorDto.address,
      description: createDebtorDto.description,
    });
    await manager.save(debtor);

    const debt = manager.create(Debt, {
      product: createDebtorDto.product,
      date: new Date(createDebtorDto.date),
      sum: createDebtorDto.sum,
      description: createDebtorDto.description,
      debtor,
    });
    await manager.save(debt);

    const period = manager.create(PeriodDebt, {
      monthlySum: createDebtorDto.monthlySum,
      isPaid: createDebtorDto.isPaid,
      remnant: createDebtorDto.remnant,
      date: new Date(),
      debt,
    });
    await manager.save(period);

    const phonesDebtor = manager.create(PhonesDebtor, {
      phoneNumber: createDebtorDto.phoneNumber,
      debtor,
    });
    await manager.save(phonesDebtor);

    const imageUrl = await this.fileService.create(imageDebt);
    const image_debt = manager.create(ImagesDebt, {
      image: imageUrl,
      debt,
    });
    await manager.save(image_debt);

    const imageDebtorUrl = await this.fileService.create(imageDebtor);
    const imageDebtorResult = manager.create(ImagesDebtor, {
      imageUrl: imageDebtorUrl,
      debtor,
    });
    await manager.save(imageDebtorResult);

    return getSuccessRes({
      debtor,
      debt,
      period,
      phonesDebtor,
      image_debt,
      imageDebtorResult,
    });
  });
}


  async updateDebtor(id: string, updateDebtorDto: UpdateDebtorDto) {
    if (updateDebtorDto.storeId) {
      await this.storeService.findOneById(updateDebtorDto.storeId);
    }

    return this.getRepository.update(id, updateDebtorDto);
  }
}
