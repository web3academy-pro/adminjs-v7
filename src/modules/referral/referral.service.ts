import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Referral } from '../../models/referral.js';
import { ReferrerIncome } from '../../models/referrer_income.js';
import CreateReferrerIncomeDto from './dto/create-referrer-income.dto.js';

@Injectable()
export class ReferralService {
  // private logger: Logger;

  constructor(
    @InjectModel(Referral) private referralRepository: typeof Referral,
    @InjectModel(ReferrerIncome)
    private referrerIncomeRepository: typeof ReferrerIncome, // @InjectModel(PaymentsOut)
    // private readonly crmService: CrmService,
  ) // private paymentsOutRepository: typeof PaymentsOut,
  {
    // this.logger = new Logger(ReferralService.name);
  }

  // async createReferral(referrerId: number, referralId: number) {
  //   try {
  //     return await this.referralRepository.create({
  //       referrerId,
  //       referralId,
  //     });
  //   } catch (e) {
  //     this.logger.log(e);
  //   }
  // }

  async getReferrerId(users_id: number) {
    const data = await this.referralRepository.findOne({
      where: {
        referralId: users_id,
      },
    });
    return data?.referrerId || null;
  }

  async getReferrerIncomeByReferrerId(id: number): Promise<ReferrerIncome> {
    return await this.referrerIncomeRepository.findOne({
      where: { user_id: id },
    });
  }

  async updateReferrerIncomeEntity(dto: Partial<ReferrerIncome>) {
    try {
      await this.referrerIncomeRepository.update(dto, {
        where: { id: dto.id },
        individualHooks: true,
      });
      return this.referrerIncomeRepository.findByPk(dto.id);
    } catch (e) {
      console.log(e);
    }
  }

  async addIncome(dto: CreateReferrerIncomeDto) {
    dto.increment_sum = dto.increment_sum * 0.3;
    const entity = await this.getReferrerIncomeByReferrerId(dto.user_id);
    if (entity) {
      await this.updateReferrerIncomeEntity({
        id: entity.id,
        available: +(entity.available + dto.increment_sum).toFixed(2),
        total: +(entity.total + dto.increment_sum).toFixed(2),
      });
    } else {
      await this.referrerIncomeRepository.create({
        user_id: dto.user_id,
        available: +dto.increment_sum.toFixed(2),
        total: +dto.increment_sum.toFixed(2),
      });
    }
  }

  // async addCryptoIncome(dto: CreateReferrerIncomeDto) {
  //   dto.increment_sum = dto.increment_sum * 0.3;
  //   const entity = await this.getReferrerIncomeByReferrerId(dto.user_id);

  //   if (entity) {
  //     await this.updateReferrerIncomeEntity({
  //       id: entity.id,
  //       available: +(entity.available + dto.increment_sum).toFixed(2),
  //       total: +(entity.total + dto.increment_sum).toFixed(2),
  //     });
  //   } else {
  //     await this.referrerIncomeRepository.create({
  //       user_id: dto.user_id,
  //       available: +dto.increment_sum.toFixed(2),
  //       total: +dto.increment_sum.toFixed(2),
  //     });
  //   }
  // }

  // async getReferralsListByReferrerId(id: number) {
  //   return await this.referralRepository.findAll({
  //     where: { referrerId: id },
  //     include: [
  //       {
  //         model: User,
  //         as: 'referral',
  //         include: [Role],
  //       },
  //     ],
  //   });
  // }

  // async createPaymentsOut(user_id: number) {
  //   const money = await this.getReferrerIncomeByReferrerId(user_id);
  //   await this.paymentsOutRepository.create({
  //     user_id,
  //     amount: money.available,
  //   });
  //   return true;
  // }

  // async getPaymentsOutHistoryByUserId(user_id: number) {
  //   this.logger.log(['GET PAYMENTS OUT HISTORY USER_ID:', user_id]);
  //   return await this.paymentsOutRepository.findAll({
  //     where: {
  //       user_id,
  //     },
  //   });
  // }

  // async getReferralRegisteredEmails(referrerId: number): Promise<string[]> {
  //   const data = await this.crmService.getRegisteredReferrals(referrerId);

  //   return data.emails.map((e) => this.maskEmail(e));
  // }

  // private maskEmail(email: string) {
  //   const str = email.split('');
  //   const finalArr = [];
  //   const len = str.indexOf('@');
  //   str.forEach((item, pos) => {
  //     pos >= 1 && pos <= len - 2 ? finalArr.push('*') : finalArr.push(str[pos]);
  //   });

  //   return finalArr.join('');
  // }
}
