import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Response } from 'express';
import { Roles } from 'src/common/decorator/roles.decorato';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import { ConfirmForgotPasswordDto } from 'src/common/dto/confirm-pass.dto';
import { VerifyOtpDto } from 'src/common/dto/verify-dto';
import { ForgetPassDto } from 'src/common/dto/forget-password.dto';
import { SignInDto } from 'src/common/dto/signIn.dto';
import { StoreSignInDto } from 'src/common/dto/store-signin';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        id: 1,
        name: 'Mega Store',
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
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in for store' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        accessToken: 'jwt_access_token',
        refreshToken: 'jwt_refresh_token',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: { message: 'Invalid credentials', error: 'Unauthorized' },
    },
  })
  signIn(
    @Body() signInDto: StoreSignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.storeService.signIn(signInDto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN)
  @Get()
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
  findAll() {
    return this.storeService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN)
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
      role: AccessRoles.STORE,
      isDeleted: false,
    };

    if (query) {
      where.login = ILike(`%${query}%`);
    }

    return this.storeService.findAllWithPagination({
      where,
      order: { createdAt: 'DESC' },
      select: { id: true, login: true, isActive: true },
      skip: page,
      take: limit,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 1,
        name: 'Mega Store',
        phone: '+998901234567',
        address: 'Tashkent',
        createdAt: '2025-09-11T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Store not found', error: 'Not Found' } },
  })
  findOne(@Param('id') id: string) {
    return this.storeService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 1,
        name: 'Mega Store Updated',
        phone: '+998901234567',
        address: 'Bukhara',
        updatedAt: '2025-09-11T14:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Store not found', error: 'Not Found' } },
  })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.updateStore(id, updateStoreDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete store by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { message: 'Store deleted successfully' } },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Store not found', error: 'Not Found' } },
  })
  remove(@Param('id') id: string) {
    return this.storeService.delete(id);
  }

  @ApiOperation({ summary: 'forget-password' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgetPassDto) {
    return this.storeService.forgotPassword(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.storeService.verifyOtp(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ConfirmForgotPasswordDto) {
    return this.storeService.confirmForgotPassword(dto);
  }
}
