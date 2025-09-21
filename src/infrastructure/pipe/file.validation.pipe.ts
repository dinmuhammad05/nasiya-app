import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = ['.jpeg', '.jpg', '.png'];
  transform(value: any) {
    try {
      if (value) {
        const fileSize = Math.floor(value.size / 1024 / 1024);
        if (fileSize > 5) {
          throw new BadRequestException('Max file size 5 MB');
        }
        const file = value?.originalname;
        const fileExtension = extname(file).toLowerCase();
        if (!this.allowedExtensions.includes(fileExtension)) {
          throw new BadRequestException(
            'Only .jpeg, .jpg, .png formats can be uploaded',
          );
        }
        return value;
      }
    } catch (error) {
      const errorObject = {
        statusCode: error?.response ? 400 : 500,
        error: {
          message: error?.response
            ? error?.message
            : `Error on image pipe: ${error}`,
        },
      };
      throw new HttpException(
        errorObject.error.message,
        errorObject.statusCode,
      );
    }
  }
}
