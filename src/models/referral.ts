import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.js';

@Table({
  tableName: 'referrals',
})
export class Referral extends Model<Referral> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;
  @BelongsTo(() => User, 'referralId')
  referral!: User;
  @ForeignKey(() => User)
  @Column
  referralId!: number;

  @BelongsTo(() => User, 'referrerId')
  referrer!: User;
  @ForeignKey(() => User)
  @Column
  referrerId!: number;
}
