import { Inject, Module, forwardRef } from '@nestjs/common';

import { InjectModel, SequelizeModule } from '@nestjs/sequelize';

// import * as redisStore from 'cache-manager-ioredis';
import { Rate, RateStatus } from '../../models/rate.js';
import {
  UnisenderGroupEnum,
  UnisenderService,
} from '../email/unisender.service.js';
import { RatesService } from './rates.service.js';
import { DiscordService } from '../discord/discord.service.js';
import { CrmService } from '../crm/crm.service.js';
import { EmailModule } from '../email/email.module.js';
import { DiscordModule } from '../discord/discord.module.js';
import { CrmModule } from '../crm/crm.module.js';
import { UsersModule } from '../users/users.module.js';
import { UsersService } from '../users/users.service.js';
import { OfferModule } from '../offer/offer.module.js';

@Module({
  providers: [RatesService],
  exports: [RatesService],
  imports: [
    OfferModule,
    // PagesComponentsModule,
    EmailModule,
    CrmModule,
    UsersModule,
    // RolesModule,
    forwardRef(() => DiscordModule),
    SequelizeModule.forFeature([Rate]),
    // CacheModule.register({
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: +process.env.REDIS_PORT,
    //   ttl: 1000,
    // }),
  ],
})
export class RatesModule {
  private uniSender: any;

  constructor(
    @InjectModel(Rate) private rateRepository: typeof Rate,
    private ratesService: RatesService,
    private userService: UsersService,
    private crmService: CrmService,
    @Inject(UnisenderService)
    private readonly unisenderService: UnisenderService,
    private readonly discordService: DiscordService,
  ) {}

  async getUserAndOfferRule(sourceEntity: Rate) {
    const offerRule = await this.ratesService.getOfferRuleByStrapiId(
      sourceEntity.getDataValue('offer_alias'),
    );
    const user = await this.userService.findByPk(
      sourceEntity.getDataValue('user_id'),
    );
    return { offerRule, user };
  }

  onModuleInit() {
    this.rateRepository.addHook('afterCreate', async (sourceEntity: Rate) => {
      const { offerRule, user } = await this.getUserAndOfferRule(sourceEntity);

      const promises = [
        this.unisenderService.deleteFromGroups(user.email, [
          offerRule.unisender_group,
          UnisenderGroupEnum.RATES_AND_SUBSCRIBERS_GROUP,
        ]),
        this.unisenderService.addToGroups(
          [user.email],
          [
            offerRule.unisender_group,
            UnisenderGroupEnum.RATES_AND_SUBSCRIBERS_GROUP,
          ],
        ),
        this.crmService.havePurchase(
          user.email,
          sourceEntity.getDataValue('offer_alias'),
        ),
      ];
      if (sourceEntity.status === RateStatus.Active) {
        promises.push(
          this.discordService.addDiscordRole(user, offerRule.discord_role),
        );
      }

      await Promise.all(promises);
    });

    this.rateRepository.addHook('afterUpdate', async (sourceEntity: Rate) => {
      const previousStatus = sourceEntity.previous('status');

      if (
        sourceEntity.status === RateStatus.Cancelled &&
        previousStatus !== RateStatus.Cancelled
      ) {
        const { offerRule, user } =
          await this.getUserAndOfferRule(sourceEntity);
        await this.discordService.deleteDiscordRole(
          user,
          offerRule.discord_role,
        );
      }
    });
  }
}
