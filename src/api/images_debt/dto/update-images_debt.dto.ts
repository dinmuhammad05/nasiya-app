import { PartialType } from '@nestjs/mapped-types';
import { CreateImagesDebtDto } from './create-images_debt.dto';

export class UpdateImagesDebtDto extends PartialType(CreateImagesDebtDto) {}
