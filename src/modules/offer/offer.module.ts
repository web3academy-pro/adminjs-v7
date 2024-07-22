import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Offer } from '../../models/offer.js';
import { OfferPaidAmount } from '../../models/offer_paid_amount.js';
import { OfferRule } from '../../models/offer_rule.js';
import { OfferRepository } from './offer.repository.js';

@Module({
  imports: [SequelizeModule.forFeature([Offer, OfferRule, OfferPaidAmount])],
  providers: [OfferRepository],
  exports: [SequelizeModule, OfferRepository],
})
export class OfferModule {}
