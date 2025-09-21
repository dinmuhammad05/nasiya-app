import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ImagesDebtService } from './images_debt.service';
import { CreateImagesDebtDto } from './dto/create-images_debt.dto';
import { UpdateImagesDebtDto } from './dto/update-images_debt.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ImageValidationPipe } from 'src/infrastructure/pipe/file.validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('ImagesDebt')
@ApiBearerAuth()
@Controller('images-debt')
@UseGuards(AuthGuard)
export class ImagesDebtController {
  constructor(private readonly imagesDebtService: ImagesDebtService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image for a debt' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        debtId: { type: 'number', example: 1 },
        image: { type: 'string', format: 'binary' },
      },
      required: ['debtId', 'image'],
    },
  })
  @ApiResponse({ status: 201, description: 'Image created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createDto: CreateImagesDebtDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imagesDebtService.createImagesDebt(createDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images for debts' })
  @ApiResponse({ status: 200, description: 'List of all images returned' })
  findAll() {
    return this.imagesDebtService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an image by ID' })
  @ApiResponse({ status: 200, description: 'Image found successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesDebtService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an image by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        debtId: { type: 'number', example: 1 },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateImagesDebtDto,
    @UploadedFile(new ImageValidationPipe()) image?: Express.Multer.File,
  ) {
    return this.imagesDebtService.updateImagesDebt(id, updateDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  remove(@Param('id') id: string) {
    return this.imagesDebtService.delete(id);
  }
}
