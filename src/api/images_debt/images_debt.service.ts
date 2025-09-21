import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesDebt } from 'src/core/entity/imagesDebt.entity';
import type { ImagesDebtRepository } from 'src/core/repository/image-debt.repository';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreateImagesDebtDto } from './dto/create-images_debt.dto';
import { UpdateImagesDebtDto } from './dto/update-images_debt.dto';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';
import { FileService } from 'src/infrastructure/file/file.service';

@Injectable()
export class ImagesDebtService extends BaseService<
  CreateImagesDebtDto,
  UpdateImagesDebtDto,
  ImagesDebt
> {
  constructor(
    @InjectRepository(ImagesDebt)
    private readonly imagesDebtRepo: ImagesDebtRepository,
    private readonly fileService: FileService,
  ) {
    super(imagesDebtRepo);
  }

  async createImagesDebt(
    createDto: CreateImagesDebtDto,
    image: Express.Multer.File,
  ) {
    const imageUrl = await this.fileService.create(image);
    const newImage = this.imagesDebtRepo.create({
      imageUrl,
      debtId: { id: createDto.debtId },
    });

    await this.imagesDebtRepo.save(newImage);
    return getSuccessRes(newImage, 201);
  }

  async updateImagesDebt(
    id: string,
    updateDto: UpdateImagesDebtDto,
    file?: Express.Multer.File,
  ) {
    const existsImage = await this.imagesDebtRepo.findOne({ where: { id } });
    if (!existsImage) throw new NotFoundException('Image not found');

    if (file) {
      if (existsImage.imageUrl) {
        await this.fileService.delete(existsImage.imageUrl);
      }

      // yangi faylni yuklash
      const newImageUrl = await this.fileService.create(file);
      existsImage.imageUrl = newImageUrl;
    }

    Object.assign(existsImage, updateDto);

    await this.imagesDebtRepo.save(existsImage);

    return getSuccessRes(existsImage, 200);
  }
}
