import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/core/entity/message.entity';
import { Debtor } from 'src/core/entity/debtor.entity';
import { SampleMessage } from 'src/core/entity/sampleMessage.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { IResponse } from 'src/common/interface/response.interface';
import { getSuccessRes } from 'src/common/util/get-success-res';

@Injectable()
export class MessageService extends BaseService<
  CreateMessageDto,
  UpdateMessageDto,
  Message
> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Debtor)
    private readonly debtorRepo: Repository<Debtor>,
    @InjectRepository(SampleMessage)
    private readonly sampleMessageRepo: Repository<SampleMessage>,
  ) {
    super(messageRepo);
  }

  async create(dto: CreateMessageDto): Promise<IResponse> {
    const debtor = await this.debtorRepo.findOne({
      where: { id: dto.debtorId },
    });
    if (!debtor) throw new NotFoundException('Debtor not found');

    let sampleMessageId: string | null = null;
    if (dto.sampleMessageId) {
      const sampleMessage = await this.sampleMessageRepo.findOne({
        where: { id: dto.sampleMessageId },
      });
      if (!sampleMessage)
        throw new NotFoundException('SampleMessage not found');
      sampleMessageId = sampleMessage.id;
    }

    const entity = this.messageRepo.create({
      debtorId: debtor.id,
      sampleMessageId: dto.sampleMessageId ?? undefined,
      status: dto.status,
    });

    await this.messageRepo.save(entity);
    return getSuccessRes(entity, 201);
  }

  async update(id: string, dto: UpdateMessageDto): Promise<IResponse> {
    const entity = await this.messageRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Message not found');

    if (dto.debtorId) {
      const debtor = await this.debtorRepo.findOne({
        where: { id: dto.debtorId },
      });
      if (!debtor) throw new NotFoundException('Debtor not found');
      entity.debtorId = debtor.id;
    }

    if (dto.sampleMessageId !== undefined) {
      entity.sampleMessageId = dto.sampleMessageId ?? null;
    }

    Object.assign(entity, dto);
    await this.messageRepo.save(entity);

    return getSuccessRes(entity);
  }
}
