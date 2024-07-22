import { Inject, Injectable, Logger } from '@nestjs/common';
import { Clients } from '../global/global.consts.js';

export enum UnisenderGroupEnum {
  SUBSCRIPTION_AND_RATES_ENDING_GROUP = '281',
  RATES_AND_SUBSCRIBERS_GROUP = '179',
  ONLY_SUBSCRIBERS_GROUP = '110',
  PRO_GROUP = '109',
  VIP_GROUP = '108',
  ADVANCED_GROUP = '107',
  BASE_GROUP = '106',
  MAIN_MAILING_GROUP = '3',
  LEFT_THE_ACADEMY = '671',
}

@Injectable()
export class UnisenderService {
  // private readonly logger = new Logger(UnisenderService.name);
  constructor(
    @Inject(Clients.UniSenderClients) private readonly uniSenderClient: any,
  ) {}

  async addToGroups(emails: string[], groupIds: string[]): Promise<void> {
    const emailListIds = groupIds.join(', ');
    await this.uniSenderClient.importContacts({
      field_names: ['email', 'email_list_ids'],
      data: emails.map((e) => ({ email: e, email_list_ids: emailListIds })),
    });
  }

  async deleteFromGroups(email: string, groupIds: string[]): Promise<void> {
    const listIds = groupIds.join(', ');
    await this.uniSenderClient.exclude({
      contact_type: 'email',
      contact: email,
      list_ids: listIds,
    });
  }
}
