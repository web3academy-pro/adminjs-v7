import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import {
  Client,
  Events,
  GatewayIntentBits,
  Guild,
  Partials,
  Role,
} from 'discord.js';

import * as process from 'process';
import { RatesService } from '../rates/rates.service.js';
import { UsersService } from '../users/users.service.js';
import { User } from 'src/models/user.js';

@Injectable()
export class DiscordService {
  private ratesService: RatesService;
  private client: Client<boolean>;
  // private logger: Logger;
  // private token: string;

  ready = false;

  constructor(
    ratesService: RatesService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService, // @Inject(forwardRef(() => RolesService)) private rolesService: RolesService,
  ) {
    // this.rolesService = rolesService;
    this.userService = userService;
    this.ratesService = ratesService;
    // this.logger = new Logger(DiscordService.name);

    const client = new Client({
      partials: [
        Partials.Reaction,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
    });

    this.client = client;

    client.on('ready', async () => {
      this.ready = true;
      // console.log(`Hello ${client.user.tag}!`);
      // console.log(`Discord is ready:`, this.ready);
    });

    // Log In our bot
    client.login(process.env.DISCORD_TOKEN);

    client.on(Events.MessageReactionAdd, async (reaction, discordUserInfo) => {
      const message = reaction.message;

      if (
        message.channelId === process.env.DISCORD_ACCESS_CHANEL && // env doesnt exist
        reaction.emoji.name === process.env.DISCORD_EMOJI
      ) {
        try {
          const discordId = discordUserInfo.id;
          const user = await this.userService.findByDiscordId(discordId);
          if (user) {
            await this.verify(user);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }

  async verify(user: User): Promise<void> {
    const rate = await this.ratesService.findActiveRateByUserId(user.id);

    if (rate && !rate.isCanViewContent()) {
      // this.logger.warn(`Аккаунт ${user.discord_id} не имеет доступа`);
      return;
    }

    const offerRules = await this.ratesService.getOfferRuleByUserId(user.id);

    try {
      const guild = await this.getGuild(true);

      if (offerRules) {
        const discordRoles = await guild.roles.fetch();
        const role: Role = discordRoles.find(
          (r) => r.name === offerRules.discord_role,
        );

        if (!role) {
          // this.logger.log([
          //   'NOT FOUND ROLE IN DISCORD:',
          //   offerRules.discord_role,
          // ]);
          return;
        }

        // this.logger.log(role.name);

        const discordUser = await guild.members.fetch({
          user: user.discord_id,
        });

        if (discordUser.roles.cache.has(role?.id)) {
          // this.logger.log(['MEMBER HAS ROLES, RETURN', discordUser.id]);
          return;
        }

        // this.logger.log(['ADD ROLE', user.email]);

        await discordUser.roles.add(role);
      }
    } catch (e) {
      console.log(e);

      return;
    }
  }

  async deleteDiscordRole(user: User, roleName?: string) {
    try {
      // this.logger.log(['start delete user', user.email]);
      if (!user.discord_id) {
        // this.logger.error(['discord id not found']);
        return;
      }
      const guild = await this.getGuild(true);

      let currentRole = roleName;
      if (!currentRole) {
        const offerRules = await this.ratesService.getOfferRuleByUserId(
          user.id,
        );
        // this.logger.log(['offer_rules', offerRules]);
        if (!offerRules) {
          // this.logger.error(['OFFER_RULES_NOT_FOUND', user.email]);
          return;
        }
        currentRole = offerRules.discord_role;
      }

      const myRole = guild.roles.cache.find(
        (role) => role.name === currentRole,
      );
      if (!myRole) {
        // this.logger.error(['CURRENT_ROLE_NOT_FOUND', myRole]);
        return;
      }
      const discordUser = await guild.members.fetch(String(user.discord_id));
      if (!discordUser) {
        // this.logger.error([
        //   'USER NOT FOUND ON SERVER',
        //   user.email,
        //   user.discord_id,
        // ]);
        return;
      }
      await discordUser.roles.remove(myRole);
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getGuild(force = false): Promise<Guild | undefined> {
    let guild = this.client.guilds.cache.get(process.env.DISCORD_SERVER_ID);

    if (!guild || force) {
      try {
        guild = await this.client.guilds.fetch(process.env.DISCORD_SERVER_ID);
      } catch (e) {
        return undefined;
      }
    }

    return guild;
  }

  async addDiscordRole(user: User, newRoleName: string): Promise<void> {
    try {
      // this.logger.log(['start change user role', user.email]);
      if (!user.discord_id) {
        // this.logger.error(['discord id not found']);
        return;
      }
      // может этот метод вызывать с параметром force=true чтобы принудительно обновлять кэш?
      const guild = await this.getGuild(true);

      const newRole = guild.roles.cache.find(
        (role) => role.name === newRoleName,
      );
      if (!newRole) {
        // this.logger.error(['NEW_ROLE_NOT_FOUND', newRoleName]);
        return;
      }
      const discordUser = await guild.members.fetch(String(user.discord_id));
      if (!discordUser) {
        // this.logger.error([
        //   'USER NOT FOUND ON SERVER',
        //   user.email,
        //   user.discord_id,
        // ]);
        return;
      }

      await discordUser.roles.add(newRole);
      // this.logger.warn([
      //   'Discord_role_added',
      //   'NEW_ROLE:',
      //   newRoleName,
      //   'EMAIL:',
      //   user.email,
      // ]);
    } catch (e) {
      // this.logger.error(['ERROR_CHANGING_ROLE', e.message]);
      return;
    }
  }

  // async deleteDiscordRoleFromAdmin(user: User) {
  //   let guild = await this.client.guilds.cache.get(
  //     process.env.DISCORD_SERVER_ID,
  //   );

  //   if (!guild) {
  //     guild = await this.client.guilds.fetch(process.env.DISCORD_SERVER_ID);
  //   }

  //   const myRole = guild.roles.cache.find((role) => role.name === 'Pro Member');
  //   // 336974993562927125
  //   try {
  //     const disUser = await guild.members.fetch(String(user.discord_id));

  //     if (disUser.roles.cache.has(myRole?.id)) {
  //       this.logger.log(['MEMBER HAS ROLES, RETURN', user.email]);
  //       return;
  //     }
  //     await disUser.roles.add(myRole);
  //     console.log('SET ROLE', disUser.user.username, user.email);
  //   } catch (e) {
  //     console.error('ERROR', user.email);
  //   }
  // }
}
