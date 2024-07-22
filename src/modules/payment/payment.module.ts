import { Module } from '@nestjs/common';
// import { PaymentController } from './payment.controller.js';
// import { PaymentService } from './payment.service.js';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { ReferralModule } from '../referral/referral.module.js';
import { Role } from '../../models/role.js';
import { Payment } from '../../models/payment.js';
import { User } from '../../models/user.js';
import { ReferralService } from '../referral/referral.service.js';
import { CurrencyConverterService } from '../global/currency.service.js';
import { OfferRepository } from '../offer/offer.repository.js';
import { OfferModule } from '../offer/offer.module.js';

@Module({
  // controllers: [PaymentController],
  // providers: [PaymentService],
  exports: [SequelizeModule],
  imports: [
    // TaskQueueModule,
    // ScheduleModule.forRoot(),
    // AuthModule,
    // RolesModule,
    ReferralModule,
    // RatesModule,
    // SubscriptionsModule,
    OfferModule,
    SequelizeModule.forFeature([Role, Payment, User]),
  ],
})
export class PaymentModule {
  constructor(
    @InjectModel(Payment)
    private paymentsRepository: typeof Payment,
    private referralService: ReferralService,
    private currencyConverterService: CurrencyConverterService,
    private readonly offerRepository: OfferRepository,
  ) {}

  onModuleInit() {
    this.paymentsRepository.addHook(
      'afterCreate',
      async (sourceEntity, options) => {
        const referrerId = await this.referralService.getReferrerId(
          sourceEntity.getDataValue('user_id'),
        );
        if (referrerId) {
          const increment_sum =
            await this.currencyConverterService.convertRUBtoUSDT(
              sourceEntity.getDataValue('amount'),
            );

          await this.referralService.addIncome({
            user_id: referrerId,
            increment_sum,
          });
        }
        if (
          sourceEntity.getDataValue('offer_alias') === 'bootcamp_30_days' ||
          sourceEntity.getDataValue('offer_alias') === 'bootcamp_90_days'
        ) {
          await this.offerRepository.incrementOfferPaidAmount('bootcamp');
        }
      },
    );
  }
}
