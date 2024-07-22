import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable } from 'sequelize/types/model';
import { OfferPaidAmount } from '../../models/offer_paid_amount.js';
import { OfferRule } from '../../models/offer_rule.js';
import { Offer } from '../../models/offer.js';

@Injectable()
export class OfferRepository {
  constructor(
    @InjectModel(Offer)
    private readonly offerRepository: typeof Offer,
    // @InjectModel(OfferRule)
    // private readonly offerRuleRepository: typeof OfferRule,
    @InjectModel(OfferPaidAmount)
    private readonly offerPaidAmountRepository: typeof OfferPaidAmount,
  ) {}

  async findByAlias(
    alias: string,
    include: Includeable[] = null,
  ): Promise<Offer | null> {
    if (include) {
      return this.offerRepository.findOne({ where: { alias }, include });
    }

    return this.offerRepository.findOne({ where: { alias } });
  }

  async findOfferRule(offerAlias: string): Promise<OfferRule | null> {
    const offer = await this.findByAlias(offerAlias, [OfferRule]);

    if (!offer) {
      return null;
    }

    if (!offer.offer_rule) {
      return null;
    }

    return offer.offer_rule;
  }

  // async findAll(): Promise<Offer[]> {
  //   return this.offerRepository.findAll();
  // }

  async incrementOfferPaidAmount(offerAlias: string): Promise<void> {
    try {
      await this.offerPaidAmountRepository.increment('amount', {
        by: 1,
        where: { offer_alias: offerAlias },
      });
    } catch (e) {
      console.log(e);
    }
  }

  // async getOfferPaidAmountByAlias(offerAlias: string): Promise<number> {
  //   try {
  //     const offerPaidAmount = await this.offerPaidAmountRepository.findOne({
  //       where: { offer_alias: offerAlias },
  //       attributes: ['amount'],
  //     });
  //     if (!offerPaidAmount) {
  //       await this.offerPaidAmountRepository.create({
  //         offer_alias: offerAlias,
  //         amount: 0,
  //       });

  //       return 0;
  //     }

  //     return offerPaidAmount.amount;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
