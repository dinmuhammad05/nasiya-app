import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { config } from 'src/config';
import { TokenService } from 'src/common/token/token';
import { Response } from 'express';
import type { AdminRepository } from 'src/core/repository/admin.repository';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { getSuccessRes } from 'src/common/util/get-success-res';
import { SignInDto } from 'src/common/dto/signIn.dto';
import { Admin } from 'src/core/entity/admin.entity';
import { IToken } from 'src/common/interface/token.interface';
import { ConfirmForgotPasswordDto } from 'src/common/dto/confirm-pass.dto';
import { ForgetPassDto } from 'src/common/dto/forget-password.dto';
import { VerifyOtpDto } from 'src/common/dto/verify-dto';
import { MailService } from '../mail/mail.service';
import { BaseService } from 'src/infrastructure/base/base.service';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AdminService extends BaseService<
  CreateAdminDto,
  UpdateAdminDto,
  Admin
> {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(adminRepo);
  }

  async onModuleInit(): Promise<void> {
    try {
      const existsSuperadmin = await this.adminRepo.findOne({
        where: { role: AccessRoles.SUPER_ADMIN },
      });

      if (!existsSuperadmin) {
        const hashedPassword = await this.crypto.encrypt(config.ADMIN_PASSWORD);
        const superadmin = this.adminRepo.create({
          username: config.ADMIN_USERNAME,
          password: hashedPassword,
          role: AccessRoles.SUPER_ADMIN,
          isActive: true,
        });
        await this.adminRepo.save(superadmin);
        console.log('Super admin created successfully');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to create super admin');
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { username, password, email } = createAdminDto;

    const existsUsername = await this.adminRepo.findOne({
      where: { username },
    });
    if (existsUsername) throw new ConflictException('Username already exists');

    if (email) {
      const existsEmail = await this.adminRepo.findOne({ where: { email } });
      if (existsEmail) throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.crypto.encrypt(password);
    const newAdmin = this.adminRepo.create({
      username,
      password: hashedPassword,
      email,
      role: AccessRoles.ADMIN,
    });

    await this.adminRepo.save(newAdmin);
    return getSuccessRes(newAdmin, 201, 'Admin created successfully');
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto, user: IToken) {
    const { username, password, email, isActive } = updateAdminDto;

    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (username) {
      const existsUsername = await this.adminRepo.findOne({
        where: { username },
      });
      if (existsUsername && existsUsername.id !== id)
        throw new ConflictException('Username already exists');
    }

    if (email) {
      const existsEmail = await this.adminRepo.findOne({ where: { email } });
      if (existsEmail && existsEmail.id !== id)
        throw new ConflictException('Email already exists');
    }

    let hashedPassword = admin.password;
    let is_active = admin.isActive;

    if (user.role === AccessRoles.SUPER_ADMIN) {
      if (password) hashedPassword = await this.crypto.encrypt(password);
      if (typeof isActive === 'boolean') is_active = isActive;
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    updateData.password = hashedPassword;
    updateData.isActive = is_active;

    await this.adminRepo.update(id, updateData);
    const updatingAdmin = await this.getRepository.findOne({ where: { id } });
    return getSuccessRes(updatingAdmin);
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const { username, password } = signInDto;

    const admin = await this.adminRepo.findOne({ where: { username } });
    
    if (!admin) throw new BadRequestException('Username or password incorrect');

    const isMatchPassword = await this.crypto.decrypt(password, admin.password);
    if (!isMatchPassword)
      throw new BadRequestException('Username or password incorrect');

    const payload: IToken = {
      id: admin.id,
      isActive: admin.isActive,
      role: admin.role,
    };

    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);

    await this.tokenService.writeCookie(res, 'adminToken', refreshToken, 15);

    return getSuccessRes({ token: accessToken }, 200, 'Login successful');
  }

  async forGetPassword(dto: ForgetPassDto) {
    const { email } = dto;
    
    const admin = await this.adminRepo.findOne({ where: { email: email } });

    if (!admin) throw new NotFoundException('Admin with this email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheManager.set(email, otp);

    await this.mailerService.sendMail(
      email,
      'Password Reset OTP',
      `Your OTP code is: ${otp}`,
    );

    return getSuccessRes(
      {
        verifyOtpUrl: `${config.BASE_URL}/admin/verify-otp`,
        requestMethod: 'POST',
        otp,
      },
      200,
      `${email} OTP sent to email successfully`,
    );
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const value: any = await this.cacheManager.get(email);
    if (!value) throw new BadRequestException('email incorect or otp expired');

    if (value !== otp) {
      throw new BadRequestException('otp incorect or expired');
    }

    await this.cacheManager.del(email);

    return getSuccessRes({
      confirmPasswordUrl: `${config.BASE_URL}/admin/reset-password`,
      requestMethod: 'PATCH',
      email,
    });
  }

  async confirmForGetPassword(dto: ConfirmForgotPasswordDto) {
    const { email, newPassword } = dto;
    const admin = await this.adminRepo.findOne({ where: { email: email } });

    if (!admin) throw new NotFoundException('Admin with this email not found');

    const hashedPassword = await this.crypto.encrypt(newPassword);

    admin.password = hashedPassword;

    await this.adminRepo.save(admin);

    return { message: 'Password reset successfully' };
  }
}
