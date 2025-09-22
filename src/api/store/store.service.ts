import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Store } from 'src/core/entity/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { StoreRepository } from 'src/core/repository/store.repository';
import { CryptoService } from 'src/common/bcrypt/Crypto';

import { getSuccessRes } from 'src/common/util/get-success-res';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { TokenService } from 'src/common/token/token';
import { Response } from 'express';
import { IToken } from 'src/common/interface/token.interface';
import { VerifyOtpDto } from 'src/common/dto/verify-dto';
import { ForgetPassDto } from 'src/common/dto/forget-password.dto';
import { ConfirmForgotPasswordDto } from 'src/common/dto/confirm-pass.dto';
import { MailService } from '../mail/mail.service';
import { StoreSignInDto } from 'src/common/dto/store-signin';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { config } from 'src/config';
import { Cache } from 'cache-manager';

@Injectable()
export class StoreService extends BaseService<
  CreateStoreDto,
  UpdateStoreDto,
  Store
> {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: StoreRepository,
    private readonly crypto: CryptoService,
    private readonly token: TokenService,
    private readonly mailerService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(storeRepo);
  }
  async createStore(createStoreDto: CreateStoreDto) {
    const existsUsername = await this.storeRepo.findOne({
      where: { email: createStoreDto.email },
    });

    if (existsUsername) throw new ConflictException('email already exists');

    const existsPhone = await this.storeRepo.findOne({
      where: { phoneNumber: createStoreDto.phoneNumber },
    });

    if (existsPhone) throw new ConflictException('Phone number already exists');

    const existsEmail = await this.storeRepo.findOne({
      where: { email: createStoreDto.email },
    });
    if (existsEmail)
      throw new ConflictException('Email address already exists');

    const hashPassword = await this.crypto.encrypt(createStoreDto.password);
    const store = this.storeRepo.create({
      password: hashPassword,
      fullName: createStoreDto.fullName,
      wallet: createStoreDto.wallet,
      phoneNumber: createStoreDto.phoneNumber,
      isActive: true,
      email: createStoreDto.email,
    });

    await this.storeRepo.save(store);
    return getSuccessRes(store, 201);
  }

  async updateStore(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepo.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    const existsemail = await this.storeRepo.findOne({
      where: { email: updateStoreDto.email },
    });
    if (existsemail && existsemail.id !== id)
      throw new ConflictException('email already exists');

    if (updateStoreDto.email) {
      const existsEmail = await this.storeRepo.findOne({
        where: { email: updateStoreDto.email },
      });
      if (existsEmail && existsEmail.id !== id)
        throw new ConflictException('Email address already exists');
    }

    if (updateStoreDto.password) {
      store.password = await this.crypto.encrypt(updateStoreDto.password);
    }
    this.storeRepo.update(id, updateStoreDto);
    await this.storeRepo.save(store);
    return getSuccessRes(store);
  }

  async signIn(signInDto: StoreSignInDto, res: Response) {
    const store = await this.storeRepo.findOne({
      where: { email: signInDto.email },
    });
    const isMatchPassword = await this.crypto.decrypt(
      signInDto.password,
      store?.password || '',
    );

    if (!isMatchPassword || !store)
      throw new BadRequestException('email or password incorrect');

    const payload: IToken = {
      id: store.id,
      isActive: store.isActive,
      role: store.role,
    };

    const accessToken = await this.token.accessToken(payload);
    const refreshToken = await this.token.refreshToken(payload);
    await this.token.writeCookie(res, 'storeToken', refreshToken, 15);
    return getSuccessRes({ accessToken });
  }

  async forGetPassword(dto: ForgetPassDto) {
    const { email } = dto;

    const store = await this.storeRepo.findOne({ where: { email } });

    if (!store) throw new NotFoundException('Store with this email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheManager.set(email, otp);

    await this.mailerService.sendMail(
      email,
      'Password Reset OTP',
      `Your OTP code is: ${otp}`,
    );

    return getSuccessRes(
      {
        verifyOtpUrl: `${config.BASE_URL}/store/verify-otp`,
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
    if (!value) throw new BadRequestException('Email incorrect or OTP expired');

    if (value !== otp) {
      throw new BadRequestException('OTP incorrect or expired');
    }

    await this.cacheManager.del(email);

    return getSuccessRes({
      confirmPasswordUrl: `${config.BASE_URL}/store/reset-password`,
      requestMethod: 'PATCH',
      email,
    });
  }

  async confirmForGetPassword(dto: ConfirmForgotPasswordDto) {
    const { email, newPassword } = dto;
    const store = await this.storeRepo.findOne({ where: { email } });

    if (!store) throw new NotFoundException('Store with this email not found');

    const hashedPassword = await this.crypto.encrypt(newPassword);

    store.password = hashedPassword;

    await this.storeRepo.save(store);

    return { message: 'Password reset successfully' };
  }
}
