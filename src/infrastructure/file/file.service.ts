import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { join } from 'path';
import { config } from 'src/config';

@Injectable()
export class FileService {
  private filePath = join(process.cwd(), '..', '..', config.FILE_PATH);
  async create(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.originalname}`;
      if (!existsSync(this.filePath)) {
        mkdirSync(this.filePath, { recursive: true });
      }
      await new Promise<void>((res, rej) => {
        writeFile(join(this.filePath, fileName), file.buffer, (err: any) => {
          if (err) rej(err);
          res();
        });
      });
      return `${config.BASE_URL}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on uploading file: ${error}`,
      );
    }
  }

  async delete(fileName: string): Promise<void> {
    try {
      const file = fileName.split(`${config.BASE_URL}/`)[1];
      const fileUrl = join(this.filePath, file);
      if (!existsSync(fileUrl)) {
        throw new BadRequestException('File not found');
      }
      await new Promise<void>((res, rej) => {
        unlink(fileUrl, (err: any) => {
          if (err) rej(err);
          res();
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on deleting file: ${error}`,
      );
    }
  }

  async exist(fileName: string): Promise<boolean> {
    try {
      const file = fileName.split(`${config.BASE_URL}/`)[1];
      const fileUrl = join(this.filePath, file);
      if (existsSync(fileUrl)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on checking file: ${error}`,
      );
    }
  }
}
