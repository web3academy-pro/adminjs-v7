import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.js';

export type SubscriptionStatus =
  | 'Draft'
  | 'Pending'
  | 'Active'
  | 'Suspended'
  | 'PendingPause'
  | 'Paused'
  | 'PendingUnPause'
  | 'Finished'
  | 'PendingCancel'
  | 'Cancelled'
  | 'Error';

@Table({ tableName: 'subscriptions_crypto' })
export class SubscriptionsCrypto extends Model<SubscriptionsCrypto> {
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
  subscribe_id: string;

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
    type: DataType.ENUM(
      'Draft',
      'Pending',
      'Active',
      'Suspended',
      'PendingPause',
      'Paused',
      'PendingUnPause',
      'Finished',
      'PendingCancel',
      'Cancelled',
      'Error',
    ),
  })
  status: SubscriptionStatus;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
