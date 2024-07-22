import { Module } from '@nestjs/common';

import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { ReferralService } from '../referral/referral.service.js';
import { PaymentsOther } from '../../models/payment_other.js';
import { User } from '../../models/user.js';
import { ReferralModule } from '../referral/referral.module.js';

@Module({
  imports: [ReferralModule, SequelizeModule.forFeature([PaymentsOther, User])],
})
export class PaymentsOtherModule {
  constructor(
    @InjectModel(PaymentsOther)
    private paymentsOther: typeof PaymentsOther,
    private referralService: ReferralService,
  ) {}

  onModuleInit() {
    this.paymentsOther.addHook('afterCreate', async (sourceEntity, options) => {
      // Use the create method of the target service to create a new entity in TargetModel
      const referrerId = await this.referralService.getReferrerId(
        sourceEntity.getDataValue('user_id'),
      );
      if (referrerId) {
        await this.referralService.addIncome({
          user_id: referrerId,
          increment_sum: sourceEntity.getDataValue('amount'),
        });
      }
    });
  }
}
