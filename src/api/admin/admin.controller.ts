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
  Res,
  Query,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorato';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { SignInDto } from 'src/common/dto/signIn.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/common/decorator/get-cooki.decorator';
import { AuthService } from '../auth/auth.service';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import { IToken } from 'src/common/interface/token.interface';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike, Repository } from 'typeorm';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ForgetPassDto } from 'src/common/dto/forget-password.dto';
import { AdminRepository } from 'src/core/repository/admin.repository';
import { Admin } from 'src/core/entity/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmForgotPasswordDto } from 'src/common/dto/confirm-pass.dto';
import { MailService } from '../mail/mail.service';
import { VerifyOtpDto } from 'src/common/dto/verify-dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly emailService: MailService,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        id: 1,
        username: 'new_admin',
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: { example: { message: 'Validation failed', error: 'Bad Request' } },
  })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Admin login (get tokens)' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        accessToken: 'jwt_token_here',
        refreshToken: 'refresh_token_here',
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
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all ADMINS' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        { id: 1, username: 'superadmin', isActive: true },
        { id: 2, username: 'root_admin', isActive: false },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: { example: { message: 'Forbidden resource', error: 'Forbidden' } },
  })
  findAll() {
    return this.adminService.findAll({
      where: { role: AccessRoles.ADMIN, isDeleted: false },
      order: { createdAt: 'DESC' },
      select: { id: true, username: true, email: true, isActive: true },
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Get('pagination')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admins with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: [
          { id: 3, username: 'admin1', isActive: true },
          { id: 4, username: 'admin2', isActive: true },
        ],
        total: 25,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: { message: 'Invalid query params', error: 'Bad Request' },
    },
  })
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query
      ? {
          username: ILike(`%${query}%`),
          role: AccessRoles.ADMIN,
          isDeleted: false,
        }
      : { role: AccessRoles.ADMIN, isDeleted: false };

    return this.adminService.findAllWithPagination({
      where,
      order: { createdAt: 'DESC' },
      select: { id: true, username: true, isActive: true },
      skip: page,
      take: limit,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { id: 5, username: 'target_admin', isActive: true } },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Admin not found', error: 'Not Found' } },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOneById(id, {
      where: {
        role: AccessRoles.ADMIN,
      },
    });
  }

  @Post('token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get new access token via refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { accessToken: 'new_access_token' } },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: { message: 'Invalid refresh token', error: 'Unauthorized' },
    },
  })
  newToken(@CookieGetter('adminToken') token: string) {
    return this.authService.newToken(this.adminService.getRepository, token);
  }

  @ApiOperation({
    summary: 'Sign out admin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin signed out successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 400,
        error: {
          message: 'Unauthorized',
        },
      },
    },
  })
  @Post('signout')
  @ApiBearerAuth()
  signOut(
    @CookieGetter('adminToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.adminService.getRepository,
      token,
      res,
      'adminToken',
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, 'ID')
  @Patch('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { id: 6, username: 'updated_admin', isActive: false } },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Admin not found', error: 'Not Found' } },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.adminService.updateAdmin(id, updateAdminDto, user);
  }

  @Patch('reset-password')
  async resetPassword(@Body() dto: ConfirmForgotPasswordDto) {
    return this.adminService.confirmForGetPassword(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
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
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminService.findOneById(id);
    await this.adminService.getRepository.update({ id }, { isDeleted: true });
    return this.adminService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hard delete admin by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { message: 'Admin deleted successfully' } },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: { example: { message: 'Admin not found', error: 'Not Found' } },
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.delete(id);
  }

  @ApiOperation({ summary: 'forget-password' })
  @Post('forget-password')
  async forgotPassword(@Body() dto: ForgetPassDto) {
    return this.adminService.forGetPassword(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.adminService.verifyOtp(dto);
  }
}
