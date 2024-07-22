import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { Payment } from '../../models/payment.js';
import { Role } from '../../models/role.js';
import { User } from '../../models/user.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  // private uniSender: any;
  // private logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User) private userRepository: typeof User, // @InjectConnection() private db: Sequelize,
    // @Inject(UnisenderService)
  ) // @Inject(forwardRef(() => RolesService)) private rolesService: RolesService,
  // private readonly unisenderService: UnisenderService,
  // @Inject(forwardRef(() => DiscordService))
  // private discordService: DiscordService,
  // @Inject(NftService)
  // private readonly nftService: NftService,
  {}

  // async checkSubscriptionByTelegram(
  //   telegram: string,
  // ): Promise<BooleanResponseDto> {
  //   const user = await this.userRepository.findOne({
  //     where: { telegram },
  //     include: [Role],
  //   });

  //   if (!user) {
  //     return {
  //       result: false,
  //     };
  //   }

  //   if (
  //     [RolesTypes.USER_PREMIUM, RolesTypes.USER_RATES].includes(
  //       user.roles.value as RolesTypes,
  //     )
  //   ) {
  //     return {
  //       result: true,
  //     };
  //   }

  //   return {
  //     result: false,
  //   };
  // }

  // async createUser(dto: CreateUserDto) {
  //   try {
  //     if (!dto.account_id) {
  //       dto.account_id = uuidv4();
  //     }
  //     dto.email = dto.email.toLowerCase().trim();
  //     const user = await this.userRepository.create(dto);
  //     await this.rolesService.setRole(user.id, dto.role);
  //     await this.unisenderService.addToGroups(
  //       [user.email],
  //       [UnisenderGroupEnum.MAIN_MAILING_GROUP],
  //     );
  //     return this.findByPk(user.id);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // async updateUser(dto: UpdateUserDto) {
  //   this.logger.log([{ ...dto }]);
  //   try {
  //     let user = await this.findByPk(dto.id);

  //     if (!user) {
  //       throw new NotFoundException(`User ${dto.id} not found`);
  //     }

  //     if (dto.discord_id === null) {
  //       this.logger.log(['Delete discord role']);

  //       await this.discordService.deleteDiscordRole(user);
  //     }

  //     const [affectedCounts] = await this.userRepository.update(dto, {
  //       where: { id: dto.id },
  //       individualHooks: true,
  //     });

  //     this.logger.log(`${user.email} updated ${affectedCounts}`);

  //     user = await this.findByPk(user.id);

  //     this.logger.log(
  //       `${user.email} dis: ${user.discord_id} wall: ${user.metamask_id}`,
  //     );

  //     if (dto.discord_id) {
  //       this.logger.log(`${user.email} discord verify`);
  //       await this.discordService.verify(user);
  //     }

  //     const isCanMintNft = await this.nftService.checkMintNft(user.id);

  //     if (dto.metamask_id && isCanMintNft) {
  //       await this.nftService.addToWhiteList(dto.metamask_id);
  //     }

  //     return user;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async findByPk(id) {
    return await this.userRepository.findByPk(id, {
      include: [Role, Payment],
    });
  }

  // async findByEmail(email: string) {
  //   return await this.userRepository.findOne({
  //     where: { email: String(email).toLowerCase().trim() },
  //     include: [Role],
  //   });
  // }

  async findByDiscordId(discord_id: string) {
    return await this.userRepository.findOne({
      where: { discord_id },
      include: [Role],
    });
  }

  // async toAcademyFree(user: User, unisenderGroups: string[]) {
  //   await this.discordService.deleteDiscordRole(user);
  //   await this.rolesService.setRole(user.id, RolesTypes.USER_REGISTER);
  //   await this.unisenderService.deleteFromGroups(user.email, unisenderGroups);
  //   await this.unisenderService.addToGroups(
  //     [user.email],
  //     [UnisenderGroupEnum.LEFT_THE_ACADEMY],
  //   );
  // }

  // async findAll(where) {
  //   return await this.userRepository.findAll({
  //     where: where || {},
  //   });
  // }

  // async getSubscriptionsEndDate(id: number) {
  //   const user = await this.userRepository.findByPk(id, {
  //     include: [Subscription, SubscriptionsCrypto, SubscriptionsOther],
  //   });

  //   return (
  //     user.subscriptions?.at(-1) ||
  //     user.subscriptionsCrypto?.at(-1) ||
  //     user.subscriptionsOther?.at(-1) ||
  //     null
  //   );
  // }
}
