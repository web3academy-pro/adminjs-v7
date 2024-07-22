import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { ConfigModule } from '@nestjs/config';
import { Redis } from 'ioredis';
import RedisStore from 'connect-redis';
import * as AdminJSSequelize from '@adminjs/sequelize';
import AdminJS from 'adminjs';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { SequelizeModule } from '@nestjs/sequelize';
import { OfferModule } from './modules/offer/offer.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';
import { ReferralModule } from './modules/referral/referral.module.js';
import { GlobalModule } from './modules/global/global.module.js';
import { PaymentsDebtModule } from './modules/payments_debt/payments_debt.module.js';
import { PaymentsOtherModule } from './modules/payments_other/payments_other.module.js';
import { RatesModule } from './modules/rates/rates.module.js';
import { CrmModule } from './modules/crm/crm.module.js';
import { DiscordModule } from './modules/discord/discord.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { UsersModule } from './modules/users/users.module.js';
import * as Models from './models/index.js';

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      // @ts-ignore
      dialect: String(process.env.DATABASE_CLIENT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      autoLoadModels: true,
      logging: false,
    }),
    SequelizeModule.forFeature([
      Models.User,
      Models.Role,
      Models.Payment,
      Models.Subscription,
      Models.SubscriptionsCrypto,
      Models.PaymentsDebt,
      Models.SubscriptionsOther,
      Models.Referral,
      Models.MintedNFT,
      Models.ReferrerIncome,
      Models.OfferPaidAmount,
      Models.PaymentsOut,
      Models.Offer,
      Models.OfferRule,
      Models.PaymentsOther,
      Models.Debts,
      Models.PaymentsCrypto,
      Models.PaytodayPayments,
      Models.Rate,
      Models.ArticlesViewsEntity,
      Models.PromoCode,
    ]),
    AdminModule.createAdminAsync({
      useFactory: async () => {
        const redisClient = new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Models.Role,
              },
              {
                resource: Models.Offer,
              },
              {
                resource: Models.OfferRule,
              },
              {
                resource: Models.User,
                options: {
                  listProperties: [
                    'email',
                    'user_roles',
                    'discord_id',
                    'metamask_id',
                    'account_id',
                    'isActivated',
                  ],
                },
              },
              {
                resource: Models.PaymentsCrypto,
                options: {
                  listProperties: [
                    'tx_hash',
                    'email',
                    'amount',
                    'currency',
                    'status',
                  ],
                },
              },
              {
                resource: Models.ReferrerIncome,
                options: {
                  listProperties: ['user_id', 'total', 'available'],
                },
              },
              {
                resource: Models.Payment,
                options: {
                  listProperties: [
                    'user_id',
                    'transaction_id',
                    'invoice_id',
                    'amount',
                    'currency',
                  ],
                },
              },
              {
                resource: Models.PaytodayPayments,
              },
              {
                resource: Models.OfferPaidAmount,
                options: ['amount', 'offer_alias'],
              },
              {
                resource: Models.PaymentsDebt,
                options: {
                  listProperties: [
                    'user_id',
                    'invoice_id',
                    'amount',
                    'currency',
                  ],
                },
              },
              {
                resource: Models.PaymentsOut,
                options: {
                  listProperties: ['user_id', 'amount', 'status'],
                },
              },
              {
                resource: Models.Subscription,
                options: {
                  listProperties: [
                    'user_id',
                    'subscribe_id',
                    'endDate',
                    'amount',
                    'period',
                    'status',
                  ],
                },
              },
              {
                resource: Models.SubscriptionsCrypto,
                options: {
                  listProperties: [
                    'user_id',
                    'subscribe_id',
                    'endDate',
                    'amount',
                    'period',
                    'currency',
                  ],
                },
              },
              {
                resource: Models.PromoCode,
                options: {
                  listProperties: ['name', 'sale', 'description', 'createdAt'],
                },
              },
              {
                resource: Models.SubscriptionsOther,
                options: {
                  listProperties: [
                    'user_id',
                    'description',
                    'endDate',
                    'amount',
                    'period',
                    'currency',
                    'status',
                  ],
                },
              },
              {
                resource: Models.ArticlesViewsEntity,
                options: {
                  listProperties: ['user_id', 'alias', 'createdAt'],
                },
              },
              {
                resource: Models.Referral,
                options: {
                  listProperties: ['id', 'referrerId', 'referralId'],
                },
              },
              {
                resource: Models.Rate,
              },
              {
                resource: Models.PaymentsOther,
                options: {
                  listProperties: [
                    'user_id',
                    'amount',
                    'currency',
                    'description',
                  ],
                },
              },
              {
                resource: Models.MintedNFT,
                options: {
                  listProperties: ['user_id', 'createdAt', 'tx_hash'],
                  showProperties: ['user_id', 'createdAt', 'tx_hash'],
                  editProperties: ['user_id', 'createdAt', 'tx_hash'],
                },
              },
              {
                resource: Models.Debts,
                options: {
                  listProperties: [
                    'phone',
                    'email',
                    'referrer_id',
                    'rates_alias',
                    'name',
                    'debt_id',
                    'createdAt',
                  ],
                },
              },
            ],
          },
          auth: {
            authenticate: async (email, password) => {
              if (
                email === process.env.ADMIN_EMAIL &&
                password === process.env.ADMIN_PASSWORD
              ) {
                return Promise.resolve({ email: process.env.ADMIN_EMAIL });
              }
            },
            cookieName: process.env.ADMIN_EMAIL,
            cookiePassword: process.env.ADMIN_PASSWORD,
          },
          sessionOptions: {
            store: new RedisStore({
              client: redisClient,
              prefix: 'admin_session::',
            }),
            resave: true,
            saveUninitialized: true,
            secret: process.env.ADMIN_SECRET,
            cookie: {
              httpOnly: true,
              secure: false, //  поменять на true  в проде
            },
            name: 'adminjs',
          },
        };
      },
    }),
    OfferModule,
    PaymentModule,
    ReferralModule,
    GlobalModule,
    PaymentsDebtModule,
    PaymentsOtherModule,
    RatesModule,
    CrmModule,
    DiscordModule,
    EmailModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
