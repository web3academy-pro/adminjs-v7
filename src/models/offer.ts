import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { OfferRule } from './offer_rule.js';

@Table({ modelName: 'offers' })
export class Offer extends Model<Offer> {
  @Column(DataType.INTEGER)
  price: number;

  @Column(DataType.STRING)
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  subscription_days: number | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_subscribe: boolean;

  @ForeignKey(() => OfferRule)
  @Column(DataType.INTEGER)
  offer_rule_id: number;

  @BelongsTo(() => OfferRule)
  offer_rule: OfferRule;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_rate: boolean;

  @Column(DataType.STRING)
  alias: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_mini_course_offer: boolean;
}
