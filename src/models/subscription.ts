import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { RecurrentStatus, RecurrentStatusType } from 'cloudpayments';
import { User } from './user.js';

@Table({ tableName: 'subscriptions' })
export class Subscription extends Model<Subscription> {
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
    type: DataType.ENUM(...Object.values(RecurrentStatus)),
  })
  status: RecurrentStatusType;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
