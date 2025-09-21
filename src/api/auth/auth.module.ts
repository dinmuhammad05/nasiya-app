import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from 'src/common/token/token';
import { AdminService } from '../admin/admin.service';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [],
  providers: [AuthService, TokenService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
