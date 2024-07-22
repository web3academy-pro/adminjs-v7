import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Offer } from './offer.js';

@Table({ modelName: 'offer_rules' })
export class OfferRule extends Model<OfferRule> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  discord_role: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  available_nft: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  can_to_subscribe: boolean;

  @Column(DataType.STRING)
  unisender_group: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  available_days: number | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  full_access: boolean;

  @Column(DataType.STRING)
  name: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  have_discord_role: boolean;

  @HasMany(() => Offer)
  offers: Offer[];
}
