import {
  BadRequestException,
  ConflictException,
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
import { SignInDto } from 'src/common/dto/signIn.dto';
import { StoreSignInDto } from 'src/common/dto/store-signin';

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
  ) {
    super(storeRepo);
  }
  async createStore(createStoreDto: CreateStoreDto) {
    const existsUsername = await this.storeRepo.findOne({
      where: { login: createStoreDto.login },
    });

    if (existsUsername) throw new ConflictException('Login already exists');

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
      login: createStoreDto.login,
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
    const existsLogin = await this.storeRepo.findOne({
      where: { login: updateStoreDto.login },
    });
    if (existsLogin && existsLogin.id !== id)
      throw new ConflictException('login already exists');

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
      where: { login: signInDto.login },
    });
    const isMatchPassword = await this.crypto.decrypt(
      signInDto.password,
      store?.password || '',
    );

    if (!isMatchPassword || !store)
      throw new BadRequestException('Login or password incorrect');

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

  async forgotPassword(dto: ForgetPassDto) {
    const store = await this.storeRepo.findOne({ where: { email: dto.email } });
    if (!store) throw new NotFoundException('store with this email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    store.otpCode = otp;
    store.otpExpiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
    await this.storeRepo.save(store);

    await this.mailerService.sendMail(
      store.email,
      'Password Reset OTP',
      `Your OTP code is: ${otp}`,
    );

    return { message: 'OTP sent to email successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const store = await this.storeRepo.findOne({ where: { email: dto.email } });
    if (!store) throw new NotFoundException('store with this email not found');

    if (!store.otpCode || !store.otpExpiresAt)
      throw new BadRequestException('OTP not found, please request a new one');

    if (store.otpExpiresAt < new Date())
      throw new UnauthorizedException('OTP expired');

    if (store.otpCode !== dto.otp)
      throw new UnauthorizedException('OTP incorrect');

    return { message: 'OTP verified successfully' };
  }

  async confirmForgotPassword(dto: ConfirmForgotPasswordDto) {
    const store = await this.storeRepo.findOne({ where: { email: dto.email } });
    if (!store) throw new NotFoundException('store with this email not found');

    if (
      !store.otpCode ||
      !store.otpExpiresAt ||
      store.otpExpiresAt < new Date()
    )
      throw new UnauthorizedException('OTP expired or incorrect');

    const hashedPassword = await this.crypto.encrypt(dto.newPassword);
    store.password = hashedPassword;
    store.otpCode = null;
    store.otpExpiresAt = null;
    await this.storeRepo.save(store);

    return { message: 'Password reset successfully' };
  }
}
