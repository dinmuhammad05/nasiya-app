import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagesDebtor } from 'src/core/entity/imagesDebtor.entity';
import { Debtor } from 'src/core/entity/debtor.entity';
import { CreateImagesDebtorDto } from './dto/create-images-debtor.dto';
import { UpdateImagesDebtorDto } from './dto/update-images-debtor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { IResponse } from 'src/common/interface/response.interface';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { FileService } from 'src/infrastructure/file/file.service';

@Injectable()
export class ImagesDebtorService extends BaseService<
  CreateImagesDebtorDto,
  UpdateImagesDebtorDto,
  ImagesDebtor
> {
  constructor(
    @InjectRepository(ImagesDebtor)
    private readonly imagesRepo: Repository<ImagesDebtor>,
    @InjectRepository(Debtor)
    private readonly debtorRepo: Repository<Debtor>,
    private readonly fileService: FileService,
  ) {
    super(imagesRepo);
  }

  async createWithFiles(
    dto: CreateImagesDebtorDto,
    files: Express.Multer.File[],
  ): Promise<IResponse> {
    const debtor = await this.debtorRepo.findOne({
      where: { id: dto.debtorId },
    });
    if (!debtor) throw new NotFoundException('Debtor not found');

    const entities = files.map((file) =>
      this.imagesRepo.create({
        imageUrl: file.filename,
        debtorId: debtor.id,
      }),
    );

    await this.imagesRepo.save(entities);
    return getSuccessRes(entities, 201);
  }

  async updateWithFiles(
    id: string,
    dto: UpdateImagesDebtorDto,
    files?: Express.Multer.File[],
  ): Promise<IResponse> {
    const entity = await this.imagesRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('ImagesDebtor not found');

    if (dto.debtorId) {
      const debtor = await this.debtorRepo.findOne({
        where: { id: dto.debtorId },
      });
      if (!debtor) throw new NotFoundException('Debtor not found');
      entity.debtorId = debtor.id;
    }

    await this.imagesRepo.delete({ debtorId: entity.debtorId });

    let savedEntities: ImagesDebtor[] = [];
    if (files && files.length > 0) {
      const newEntities = files.map((file) =>
        this.imagesRepo.create({
          imageUrl: file.filename,
          debtorId: dto.debtorId ?? entity.debtorId,
        }),
      );
      savedEntities = await this.imagesRepo.save(newEntities);
    }

    Object.assign(entity, dto);
    await this.imagesRepo.save(entity);

    return getSuccessRes({ updated: entity, newFiles: savedEntities });
  }
}
