import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { IResponse } from 'src/common/interface/response.interface';
import { SampleMessage } from 'src/core/entity/sampleMessage.entity';
import { Store } from 'src/core/entity/store.entity';
import { CreateSampleMessageDto } from './dto/create-sample-message.dto';
import { UpdateSampleMessageDto } from './dto/update-sample-message.dto';
import { BaseService } from 'src/infrastructure/base/base.service';

@Injectable()
export class SampleMessageService extends BaseService<
  CreateSampleMessageDto,
  UpdateSampleMessageDto,
  SampleMessage
> {
  constructor(
    @InjectRepository(SampleMessage)
    private readonly sampleMessageRepo: Repository<SampleMessage>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {
    super(sampleMessageRepo);
  }

  async create(dto: CreateSampleMessageDto): Promise<IResponse> {
    const store = await this.storeRepo.findOne({ where: { id: dto.storeId } });
    if (!store) throw new NotFoundException('Store not found');

    const entity = this.sampleMessageRepo.create({ ...dto, store });
    await this.sampleMessageRepo.save(entity);

    return getSuccessRes(entity, 201);
  }

  async update(id: string, dto: UpdateSampleMessageDto): Promise<IResponse> {
    const entity = await this.sampleMessageRepo.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!entity) throw new NotFoundException('SampleMessage not found');

    if (dto.storeId) {
      const store = await this.storeRepo.findOne({
        where: { id: dto.storeId },
      });
      if (!store) throw new NotFoundException('Store not found');
      entity.store = store;
    }

    Object.assign(entity, dto);
    await this.sampleMessageRepo.save(entity);

    return getSuccessRes(entity);
  }
}
