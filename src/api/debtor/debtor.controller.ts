import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
  UploadedFile,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import { Roles } from 'src/common/decorator/roles.decorato';
import { ImageValidationPipe } from 'src/infrastructure/pipe/file.validation.pipe';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@ApiTags('Debtor')
@Controller('debtor')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN, AccessRoles.STORE)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new debtor' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Eshmat Toshmatov' },
        address: { type: 'string', example: 'Chilonzor' },
        product: { type: 'string', example: 'iPhone 17 jiggarangidan' },
        date: { type: 'string', format: 'date', example: '2025-09-10' },
        period: { type: 'number', enum: [1, 3, 6, 12], example: 12 },
        sum: { type: 'number', example: 1500.5 },
        description: { type: 'string', example: 'Some description' },
        monthlySum: { type: 'number', example: 150.0 },
        remnant: { type: 'number', example: 1200.0 },
        phoneNumber: { type: 'string', example: '+998901112233' },
        imageDebt: {
          type: 'string',
          format: 'binary',
          description: 'Image of debt (upload)',
        },
        imageDebtor: {
          type: 'string',
          format: 'binary',
          description: 'Image of debtor (upload)',
        },
      },
      required: [
        'storeId',
        'fullName',
        'address',
        'product',
        'date',
        'period',
        'sum',
        'monthlySum',
        'phoneNumber',
        'imageDebt',
        'imageDebtor',
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageDebt', maxCount: 1 },
      { name: 'imageDebtor', maxCount: 1 },
    ]),
  )
  create(
    @Body() createDebtorDto: CreateDebtorDto,
    @UploadedFiles()
    files: {
      imageDebt?: Express.Multer.File[];
      imageDebtor?: Express.Multer.File[];
    },
  ) {
    return this.debtorService.createDebtor(
      createDebtorDto,
      files.imageDebt![0],
      files.imageDebtor![0],
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN, AccessRoles.STORE)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all debtors' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 1,
          fullname: 'John Doe',
          phone: '+998901234567',
          address: 'Tashkent',
          createdAt: '2025-09-11T12:00:00.000Z',
        },
        {
          id: 2,
          fullname: 'Jane Smith',
          phone: '+998909876543',
          address: 'Samarkand',
          createdAt: '2025-09-11T13:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: { example: { message: 'Forbidden resource', error: 'Forbidden' } },
  })
  findAll() {
    return this.debtorService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN, AccessRoles.STORE)
  @Get('pagination')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 1,
          name: 'Mega Store',
          phone: '+998901234567',
          address: 'Tashkent',
          createdAt: '2025-09-11T12:00:00.000Z',
        },
        {
          id: 2,
          name: 'Mini Market',
          phone: '+998909876543',
          address: 'Samarkand',
          createdAt: '2025-09-11T13:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: { example: { message: 'Forbidden resource', error: 'Forbidden' } },
  })
  async findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, limit, page } = queryDto;

    const where: any = {
      isDeleted: false,
    };

    if (query) {
      where.fullName = ILike(`%${query}%`);
    }

    return this.debtorService.findAllWithPagination({
      where,
      order: { createdAt: 'DESC' },
      select: { id: true, fullName: true, isActive: true },
      skip: page,
      take: limit,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN, AccessRoles.STORE)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get debtor by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 1,
        fullname: 'John Doe',
        phone: '+998901234567',
        address: 'Tashkent',
        createdAt: '2025-09-11T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Debtor not found', error: 'Not Found' } },
  })
  findOne(@Param('id') id: string) {
    return this.debtorService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN, AccessRoles.STORE)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update debtor by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 1,
        fullname: 'John Doe Updated',
        phone: '+998901234567',
        address: 'Bukhara',
        updatedAt: '2025-09-11T14:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Debtor not found', error: 'Not Found' } },
  })
  update(@Param('id') id: string, @Body() updateDebtorDto: UpdateDebtorDto) {
    return this.debtorService.updateDebtor(id, updateDebtorDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN, AccessRoles.STORE)
  @Patch('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { id: 7, username: 'deleted_admin', isDeleted: true } },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Admin not found', error: 'Not Found' } },
  })
  async softDelete(@Param('id') id: string) {
    await this.debtorService.findOneById(id);
    await this.debtorService.getRepository.update({ id }, { isDeleted: true });
    return this.debtorService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN, AccessRoles.STORE)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete debtor by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { message: 'Debtor deleted successfully' } },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Debtor not found', error: 'Not Found' } },
  })
  remove(@Param('id') id: string) {
    return this.debtorService.delete(id);
  }
}
