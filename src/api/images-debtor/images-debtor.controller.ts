import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ImagesDebtorService } from './images-debtor.service';
import { CreateImagesDebtorDto } from './dto/create-images-debtor.dto';
import { UpdateImagesDebtorDto } from './dto/update-images-debtor.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorator/roles.decorato';

@ApiTags('Images Debtor')
@Controller('images-debtor')
@UseGuards(AuthGuard, RolesGuard)
export class ImagesDebtorController {
  constructor(private readonly imagesDebtorService: ImagesDebtorService) {}

  @Roles(AccessRoles.STORE)
  @Post()
  @ApiOperation({ summary: 'Create image debtor with files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images successfully created' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/images-debtor',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateImagesDebtorDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesDebtorService.createWithFiles(dto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all image debtors' })
  @ApiResponse({ status: 200, description: 'List of all image debtors' })
  findAll() {
    return this.imagesDebtorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image debtor by ID' })
  @ApiResponse({ status: 200, description: 'Image debtor found' })
  @ApiResponse({ status: 404, description: 'Image debtor not found' })
  findOne(@Param('id') id: string) {
    return this.imagesDebtorService.findOneById(id);
  }

  @Patch(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update image debtor (old files removed, new ones added)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Images updated successfully' })
  @ApiResponse({ status: 404, description: 'Debtor not found' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/images-debtor',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateImagesDebtorDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesDebtorService.updateWithFiles(id, dto, files);
  }

  @Delete(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete image debtor' })
  @ApiResponse({ status: 200, description: 'Image debtor deleted' })
  @ApiResponse({ status: 404, description: 'Image debtor not found' })
  remove(@Param('id') id: string) {
    return this.imagesDebtorService.delete(id);
  }
}
