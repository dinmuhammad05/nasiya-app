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
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import {
  ApiBearerAuth,
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

@ApiTags('Debtor')
@Controller('debtor')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.SUPER_ADMIN, AccessRoles.STORE)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new debtor' })
  @ApiResponse({
    status: HttpStatus.CREATED,
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
    status: HttpStatus.BAD_REQUEST,
    schema: { example: { message: 'Validation failed', error: 'Bad Request' } },
  })
  create(@Body() createDebtorDto: CreateDebtorDto) {
    return this.debtorService.createDebtor(createDebtorDto);
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
