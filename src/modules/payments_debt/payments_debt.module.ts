import { Module } from '@nestjs/common';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { Debts } from '../../models/debt.js';
import { PaymentsDebt } from '../../models/payment_debt.js';
import { Role } from '../../models/role.js';
import { User } from '../../models/user.js';
import { ReferralService } from '../referral/referral.service.js';
import { CurrencyConverterService } from '../global/currency.service.js';
import { ReferralModule } from '../referral/referral.module.js';

@Module({
  imports: [
    ReferralModule,
    SequelizeModule.forFeature([Role, PaymentsDebt, User, Debts]),
  ],
  exports: [SequelizeModule],
})
export class PaymentsDebtModule {
  constructor(
    @InjectModel(PaymentsDebt)
    private paymentsRepository: typeof PaymentsDebt,
    private referralService: ReferralService,
    private currencyConverterService: CurrencyConverterService,
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
            user_id: +referrerId,
            increment_sum,
          });
        }
      },
    );
  }
}
