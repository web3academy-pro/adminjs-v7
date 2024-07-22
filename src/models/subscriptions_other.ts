import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.js';

export enum SubscriptionOtherStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
}

@Table({ tableName: 'subscriptions_other' })
export class SubscriptionsOther extends Model<SubscriptionsOther> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    defaultValue: null,
  })
  description: string;

  @Column({
    type: DataType.DOUBLE,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: string;

  @Column({
    type: DataType.STRING,
  })
  currency: string;

  @Column({
    type: DataType.INTEGER,
  })
  period: number;

  @Column({
    type: DataType.ENUM(...Object.values(SubscriptionOtherStatus)),
  })
  status: SubscriptionOtherStatus;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
