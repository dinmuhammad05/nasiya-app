import { PartialType } from '@nestjs/mapped-types';
import { CreateImagesDebtorDto } from './create-images-debtor.dto';

export class UpdateImagesDebtorDto extends PartialType(CreateImagesDebtorDto) {}
