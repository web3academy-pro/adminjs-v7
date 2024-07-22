import {
  // CACHE_MANAGER,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
// import { Cache } from 'cache-manager';
import moment from 'moment';
import sequelize, { Op } from 'sequelize';
import { OfferRepository } from '../offer/offer.repository.js';
import { Rate, RateStatus } from '../../models/rate.js';
import { OfferRule } from '../../models/offer_rule.js';

@Injectable()
export class RatesService {
  // private logger: Logger;

  constructor(
    @InjectModel(Rate) private rateRepository: typeof Rate,
    // @Inject(Clients.GraphQLClients)
    // private readonly gqlClient: GraphQlClientType,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // @Inject(forwardRef(() => RolesService)) private userService: UsersService,
    // @Inject(UnisenderService)
    // private readonly unisenderService: UnisenderService,
    // @Inject(PageComponentsService)
    // private readonly pageComponentsService: PageComponentsService,
    private readonly offerRepository: OfferRepository, // private readonly roleService: RolesService,
  ) {
    // this.logger = new Logger(RatesService.name);
  }

  async getOfferRuleByStrapiId(offerAlias: string) {
    return this.offerRepository.findOfferRule(offerAlias);
  }

  // async getUpgradeOffers(user: User): Promise<OffersResponseDto[]> {
  //   const rates = await this.pageComponentsService.getRates();

  //   return this.setUpgradeOffer(user, rates);
  // }

  // async getUpgradeOffer(
  //   user: User,
  //   offerAlias: string,
  // ): Promise<OffersResponseDto> {
  //   const rates = await this.pageComponentsService.getRates();
  //   const rate = rates.find((r) => r.alias === offerAlias);

  //   const upgradedOffer = await this.setUpgradeOffer(user, [rate]);

  //   return upgradedOffer[0];
  // }

  // private async setUpgradeOffer(
  //   user: User,
  //   offers: OffersResponseDto[],
  // ): Promise<OffersResponseDto[]> {
  //   const currentRate = await this.findActiveRateByUserId(user.id);
  //   const endDate = moment(currentRate.endDate);
  //   const today = moment().startOf('day');
  //   const daysLeft = endDate.diff(today, 'days');
  //   this.logger.log(
  //     `Сейчас: ${today}; Конец тарифа ${endDate}; Осталось ${daysLeft}`,
  //   );

  //   if (daysLeft <= 0) {
  //     return offers;
  //   }

  //   for await (const offer of offers) {
  //     const newRateRule = await this.getOfferRuleByStrapiId(offer.alias);
  //     const newRateAvailableDays = newRateRule.available_days - daysLeft;

  //     if (
  //       newRateAvailableDays <= 0 ||
  //       !this.isUpperRate(currentRate.offer_alias, offer.alias)
  //     ) {
  //       offer.price = null;
  //       offer.subscription_days = null;
  //       offer.beforeSalePrice = null;

  //       continue;
  //     }

  //     const offerPricePerDay = offer.price / newRateRule.available_days;

  //     offer.price = +(offerPricePerDay * newRateAvailableDays).toFixed(2);
  //     offer.subscription_days = newRateAvailableDays;
  //   }

  //   return offers;
  // }

  // isUpperRate(currentRateAlias: string, newRateAlias: string): boolean {
  //   const rateAlais = [
  //     'base_rates',
  //     'advanced_rates',
  //     'expert_rates',
  //     'pro_rates',
  //   ];
  //   const currentLevelIndex = rateAlais.indexOf(currentRateAlias);
  //   const newLevelIndex = rateAlais.indexOf(newRateAlias);

  //   if (currentLevelIndex === -1 || newLevelIndex === -1) {
  //     return false;
  //   }

  //   return currentLevelIndex < newLevelIndex;
  // }

  // async findAllActiveRatesByUserId(user_id) {
  //   return this.rateRepository.findAll({
  //     where: {
  //       user_id,
  //       status: RateStatus.Active,
  //     },
  //   });
  // }

  // async findAll(userId: number): Promise<Rate[]> {
  //   return this.rateRepository.findAll({
  //     where: {
  //       user_id: userId,
  //     },
  //   });
  // }

  // async findAllActiveRates(): Promise<Rate[]> {
  //   return this.rateRepository.findAll({
  //     where: {
  //       status: RateStatus.Active,
  //       endDate: {
  //         [Op.not]: null,
  //       },
  //     },
  //     include: [User],
  //   });
  // }

  // async updateEndDate(rate: Rate, endDate: string): Promise<Rate> {
  //   rate.endDate = endDate;
  //   return rate.save();
  // }

  // async findByDaysLeft(dayLeft: number): Promise<Rate[]> {
  //   const currentDate = new Date();
  //   const endDateCriteria = new Date();
  //   endDateCriteria.setDate(currentDate.getDate() + dayLeft);

  //   return this.rateRepository.findAll({
  //     where: {
  //       status: RateStatus.Active,
  //       endDate: {
  //         [Op.between]: [currentDate, endDateCriteria],
  //       },
  //     },
  //     include: [User],
  //   });
  // }

  // async findActiveByOfferAlias(offerAlias: string): Promise<Rate[]> {
  //   return this.rateRepository.findAll({
  //     where: {
  //       offer_alias: offerAlias,
  //       status: RateStatus.Active,
  //     },
  //     include: [User],
  //   });
  // }

  async findActiveRateByUserId(userId: number) {
    return this.rateRepository.findOne({
      where: {
        user_id: userId,
        status: RateStatus.Active,
      },
    });
  }

  // async getOfferInfoByStrapiId(offerAlias: string) {
  //   return this.offerRepository.findByAlias(offerAlias);
  // }

  async getOfferRuleByUserId(user_id): Promise<OfferRule | null> {
    const rate = await this.findActiveRateByUserId(user_id);
    if (!rate) return null;
    return this.offerRepository.findOfferRule(rate.offer_alias);
  }

  // async getCanToSubscribeStatus(user_id) {
  //   try {
  //     const rates = await this.rateRepository.findOne({
  //       where: {
  //         user_id,
  //         status: RateStatus.Active,
  //       },
  //     });

  //     if (!rates) {
  //       return false;
  //     }

  //     const offerRule = await this.offerRepository.findOfferRule(
  //       rates.offer_alias,
  //     );

  //     return offerRule.can_to_subscribe;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  // async getOfferInfoByUserId(user_id: number) {
  //   const rate = await this.getActiveRateByUserId(user_id);

  //   if (!rate) {
  //     return null;
  //   }

  //   return this.offerRepository.findByAlias(rate.offer_alias);
  // }

  // async getActiveRateByUserId(user_id: number) {
  //   const userRates = await this.findAllActiveRatesByUserId(user_id);
  //   return userRates.at(0);
  // }

  // async upgradeRate(
  //   userId: number,
  //   availableDays: number,
  //   newOfferAlias: string,
  // ) {
  //   const endDate = moment().add(availableDays, 'days').toDate();
  //   await this.rateRepository.update(
  //     {
  //       offer_alias: newOfferAlias,
  //       endDate: endDate.toUTCString(),
  //     },
  //     {
  //       where: {
  //         user_id: userId,
  //       },
  //     },
  //   );
  // }

  // async createRateRecord(user_id, offer: Offer) {
  //   try {
  //     const offerRules = await this.getOfferRuleByStrapiId(offer.alias);
  //     const frozenUntilDate = new Date('2024-07-01T09:00:00Z'); // тут так надо чтобы выйти на 12 по мск
  //     const currentTime = offer.alias.includes('bootcamp')
  //       ? new Date('2024-07-01T09:00:00Z')
  //       : new Date();
  //     currentTime.setHours(
  //       currentTime.getHours() + offerRules.available_days * 24,
  //     );

  //     const previousRate = await this.rateRepository.findAll({
  //       where: {
  //         user_id,
  //       },
  //     });
  //     if (previousRate.length) {
  //       await this.allRatesToCanceled(previousRate);
  //     }
  //     const createdDate = new Date();
  //     if (createdDate >= NEW_START_DATE && createdDate < STUDYING_START_DATE) {
  //       const diff = moment(STUDYING_START_DATE).diff(createdDate, 'days') + 1;
  //       currentTime.setHours(currentTime.getHours() + diff * 24);
  //     }

  //     const result = await this.rateRepository.create({
  //       user_id,
  //       offer_alias: offer.alias,
  //       status: RateStatus.Active,
  //       endDate:
  //         offer.is_rate || offer.is_subscribe
  //           ? currentTime.toUTCString()
  //           : null,
  //       frozen_until:
  //         offer.alias.includes('bootcamp') && createdDate < frozenUntilDate
  //           ? frozenUntilDate.toUTCString()
  //           : null,
  //     });
  //     return result;
  //   } catch (error) {
  //     console.error('Error creating rate record:', error);
  //   }
  // }

  // async allRatesToCanceled(array: Rate[]) {
  //   for (const rate of array) {
  //     rate.status = RateStatus.Cancelled;
  //     await rate.save();
  //   }
  // }

  // async allRatesToCanceledByUserId(user_id) {
  //   const userRates = await this.findAllActiveRatesByUserId(user_id);
  //   await this.allRatesToCanceled(userRates);
  // }

  // async getExpiredRates(): Promise<Rate[]> {
  //   return this.rateRepository.findAll({
  //     where: {
  //       status: RateStatus.Active,
  //       endDate: {
  //         [Op.not]: null,
  //         [Op.lte]: sequelize.literal("NOW() - interval '3 days'"),
  //       },
  //       offer_alias: {
  //         [Op.not]: 'infinity_offer',
  //       },
  //     },
  //     include: [
  //       {
  //         model: User,
  //       },
  //     ],
  //   });
  // }

  // async findAllWrongRates() {
  //   const proRole = await this.roleService.getRoleByValue(
  //     RolesTypes.USER_PREMIUM,
  //   );
  //   const rateRole = await this.roleService.getRoleByValue(
  //     RolesTypes.USER_RATES,
  //   );

  //   return this.rateRepository.findAll({
  //     include: [
  //       {
  //         model: User,
  //         where: {
  //           user_roles: {
  //             [Op.or]: [proRole.id, rateRole.id],
  //           },
  //         },
  //       },
  //     ],
  //     where: {
  //       status: RateStatus.Cancelled,
  //     },
  //   });
  // }

  // @Cron('0 0 */2 * *')
  // private async updateUnisenderGroup() {
  //   const in7Days = moment().add(7, 'day');
  //   const now = moment();

  //   const rates = await this.rateRepository.findAll({
  //     where: {
  //       status: RateStatus.Active,
  //       offer_alias: {
  //         [Op.in]: ['expert_rates', 'pro_rates'],
  //       },
  //       endDate: {
  //         [Op.not]: null,
  //         [Op.lte]: in7Days.toDate(),
  //         [Op.gte]: now.toDate(),
  //       },
  //     },
  //     include: [
  //       {
  //         model: User,
  //         include: [Role],
  //       },
  //     ],
  //   });

  //   const emailsToRatesGroup = rates.map((r) => r.user.email);

  //   await this.unisenderService.addToGroups(emailsToRatesGroup, [
  //     UnisenderGroupEnum.SUBSCRIPTION_AND_RATES_ENDING_GROUP,
  //   ]);
  // }
}
