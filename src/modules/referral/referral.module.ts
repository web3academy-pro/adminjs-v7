import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service.js';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.js';
import { Referral } from '../../models/referral.js';
import { ReferrerIncome } from '../../models/referrer_income.js';
import { PaymentsOut } from '../../models/payment_out.js';

@Module({
  providers: [ReferralService],
  exports: [ReferralService, SequelizeModule],
  imports: [
    SequelizeModule.forFeature([User, Referral, ReferrerIncome, PaymentsOut]),
  ],
})
export class ReferralModule {
  constructor(
    @InjectModel(PaymentsOut)
    private paymentsOutRepository: typeof PaymentsOut,
    private referralService: ReferralService,
  ) {}
  async onModuleInit() {
    this.paymentsOutRepository.addHook(
      'afterCreate',
      async (sourceEntity, options) => {
        const referrerIncome =
          await this.referralService.getReferrerIncomeByReferrerId(
            sourceEntity.getDataValue('user_id'),
          );
        if (referrerIncome) {
          await this.referralService.updateReferrerIncomeEntity({
            id: referrerIncome.id,
            available:
              referrerIncome.available - sourceEntity.getDataValue('amount'),
          });
        }
      },
    );
  }
}
