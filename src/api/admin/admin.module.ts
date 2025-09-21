import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/common/token/token';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { AuthModule } from '../auth/auth.module';
import { Admin } from 'src/core/entity/admin.entity';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), MailModule, AuthModule],
  providers: [AdminService, CryptoService, TokenService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
Admin;
