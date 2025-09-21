import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { DebtorModule } from './debtor/debtor.module';
import { AuthModule } from './auth/auth.module';
import { DebtModule } from './debt/debt.module';
import { ImagesDebtorModule } from './images-debtor/images-debtor.module';
import { ImagesDebtModule } from './images_debt/images_debt.module';
import { MessagesModule } from './messages/messages.module';
import { PaymentModule } from './payment/payment.module';
import { PeriodDebtModule } from './period-debt/period-debt.module';
import { PhonesDebtorModule } from './phones_debtor/phones_debtor.module';
import { SampleMessageModule } from './sample-message/sample-message.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: config.LIMIT_TIME * 1000 * 60,
        limit: config.LIMIT,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: String(config.DB_URI),
      autoLoadEntities: true,
      synchronize: config.DB_SYNC,
    }),

    JwtModule.register({
      global: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: config.CACHE_TIME * 1000 * 60,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', '..', config.FILE_PATH),
      serveRoot: `/api/v1${config.FILE_PATH}`,
    }),

    AdminModule,
    StoreModule,
    DebtorModule,
    AuthModule,
    DebtorModule,
    DebtModule,
    ImagesDebtorModule,
    ImagesDebtModule,
    MessagesModule,
    PaymentModule,
    PeriodDebtModule,
    PhonesDebtorModule,
    SampleMessageModule,
    MailerModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
