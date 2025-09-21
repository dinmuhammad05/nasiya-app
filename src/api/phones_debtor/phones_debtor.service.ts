import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhonesDebtor } from 'src/core/entity/phonesDebtor.entity';
import type { PhonesDebtorRepository } from 'src/core/repository/phone-debtor.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreatePhonesDebtorDto } from './dto/create-phones_debtor.dto';
import { UpdatePhonesDebtorDto } from './dto/update-phones_debtor.dto';
import { getSuccessRes } from 'src/common/util/get-success-res';

@Injectable()
export class PhonesDebtorService extends BaseService<
  CreatePhonesDebtorDto,
  UpdatePhonesDebtorDto,
  PhonesDebtor
> {
  constructor(
    @InjectRepository(PhonesDebtor)
    private readonly phonesDebtorRepo: PhonesDebtorRepository,
  ) {
    super(phonesDebtorRepo);
  }

  async create(createDto: CreatePhonesDebtorDto) {
    const exists = await this.phonesDebtorRepo.findOne({
      where: { phoneNumber: createDto.phoneNumber },
    });
    if (exists) throw new ConflictException('Phone number already exists');

    const phone = this.phonesDebtorRepo.create({
      phoneNumber: createDto.phoneNumber,
      debtorId: { id: createDto.debtorId },
    });

    await this.phonesDebtorRepo.save(phone);
    return getSuccessRes(phone, 201);
  }

  async findAll() {
    const all = await this.phonesDebtorRepo.find();
    return getSuccessRes(all);
  }

  async findOneById(id: string) {
    const phone = await this.phonesDebtorRepo.findOne({ where: { id } });
    if (!phone) throw new NotFoundException('Phone record not found');
    return getSuccessRes(phone);
  }

  async update(id: string, updateDto: UpdatePhonesDebtorDto) {
    const phone = await this.phonesDebtorRepo.findOne({ where: { id } });
    if (!phone) throw new NotFoundException('Phone record not found');

    if (updateDto.phoneNumber && updateDto.phoneNumber !== phone.phoneNumber) {
      const exists = await this.phonesDebtorRepo.findOne({
        where: { phoneNumber: updateDto.phoneNumber },
      });
      if (exists && exists.id !== id)
        throw new ConflictException('Phone number already exists');
    }

    Object.assign(phone, updateDto);
    await this.phonesDebtorRepo.save(phone);

    return getSuccessRes(phone, 200);
  }

  async remove(id: string) {
    const phone = await this.phonesDebtorRepo.findOne({ where: { id } });
    if (!phone) throw new NotFoundException('Phone record not found');

    await this.phonesDebtorRepo.remove(phone);
    return getSuccessRes({ message: 'Deleted successfully' }, 200);
  }
}
