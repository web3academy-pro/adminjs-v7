import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { CreationAttributes } from 'sequelize/types/model';
import { CreateCrmContactDto } from './dto/create-crm.dto.js';
import { Debts } from '../../models/debt.js';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);
  url: string;
  constructor(@InjectModel(Debts) private debtorRepository: typeof Debts) {
    this.url = process.env.CRM_ENDPOINT + '/crm';
  }
  // async create(body: CreateCrmContactDto) {
  //   try {
  //     if (body.debt_id) {
  //       const existContact = await this.debtorRepository.findOne({
  //         where: {
  //           email: body.email,
  //         },
  //       });

  //       if (!existContact) {
  //         await this.debtorRepository.create(this.toDebt(body));
  //       } else {
  //         await this.debtorRepository.update(
  //           {
  //             debt_id: body.debt_id,
  //             referrer_id: existContact.referrer_id
  //               ? existContact.referrer_id
  //               : body.referrer_id,
  //           },
  //           {
  //             where: {
  //               id: existContact.id,
  //             },
  //           },
  //         );
  //       }
  //     }

  //     return this.createContact(body);
  //   } catch (e) {
  //     this.logger.error(e.message, e.stack);
  //   }
  // }

  // async createContact(dto: CreateCrmContactDto) {
  //   try {
  //     this.logger.log('createContact:');
  //     this.logger.log(dto);
  //     const { data } = await axios.post(this.url + '/contact', dto);

  //     return data;
  //   } catch (e) {
  //     this.logger.error(e);
  //   }
  // }

  // async findContactByEmail(email: string) {
  //   try {
  //     const { data } = await axios.get(this.url + '/contact/' + email);

  //     return data;
  //   } catch (e) {
  //     this.logger.error(e);
  //   }
  // }

  // private toDebt(dto: CreateCrmContactDto): CreationAttributes<Debts> {
  //   return {
  //     phone: dto.phone && dto.phone.toString(),
  //     email: dto.email,
  //     referrer_id: dto.referrer_id,
  //     rates_alias: dto.rates_alias,
  //     name: dto.name,
  //     debt_id: dto.debt_id,
  //   };
  // }

  // private toDto(entitiy: Debts): CreateCrmContactDto {
  //   return {
  //     phone: entitiy.phone && Number(entitiy.phone),
  //     email: entitiy.email,
  //     referrer_id: entitiy.referrer_id,
  //     rates_alias: entitiy.rates_alias,
  //     name: entitiy.name,
  //     debt_id: entitiy.debt_id,
  //   };
  // }

  // async findOneByEmail(email: string): Promise<CreateCrmContactDto> {
  //   let debt = await this.debtorRepository.findOne({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (!debt) {
  //     const data = await this.findContactByEmail(email);

  //     debt = await this.debtorRepository.create(this.toDebt(data), {
  //       returning: true,
  //     });
  //   }

  //   return this.toDto(debt);
  // }

  // async findOneByEmailFromCrm(email: string): Promise<CreateCrmContactDto> {
  //   try {
  //     const { data } = await axios.get(this.url + '/contact/' + email);

  //     return data;
  //   } catch (e) {
  //     console.log(`Cannot find by email from crm: ${email}`);
  //     console.log(e);
  //     throw e;
  //   }
  // }

  // async findOneByIdFromCrm(id: string): Promise<CreateCrmContactDto> {
  //   try {
  //     const { data } = await axios.get(this.url + '/contact/' + id);

  //     return data;
  //   } catch (e) {
  //     console.log(`Cannot find by id from crm: ${id}`);
  //     console.log(e);
  //     throw e;
  //   }
  // }

  // async findOneById(id: string): Promise<CreateCrmContactDto> {
  //   const debt = await this.debtorRepository.findOne({
  //     where: {
  //       debt_id: id,
  //     },
  //   });

  //   if (!debt) {
  //     return this.findOneByIdFromCrm(id);
  //   }

  //   return this.toDto(debt);
  // }

  async havePurchase(email: string, rates_alias: string) {
    try {
      const { data } = await axios.patch(this.url + '/lead/havePurchase', {
        email,
        rates_alias,
      });
      return data;
    } catch (e) {
      console.log(e?.message);
    }
  }

  // async getRegisteredReferrals(
  //   referrerId: number,
  // ): Promise<RegisteredContactDto> {
  //   try {
  //     const { data } = await axios.get(this.url + `/contacts/${referrerId}`);
  //     return data;
  //   } catch (e) {
  //     console.log(e?.message);
  //   }
  // }
}
