import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/core/entity/store.entity';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { TokenService } from 'src/common/token/token';
import { MailModule } from '../mail/mail.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), MailModule],
  controllers: [StoreController],
  providers: [StoreService, CryptoService, TokenService, AuthService],
  exports: [StoreService, TypeOrmModule],
})
export class StoreModule {}
