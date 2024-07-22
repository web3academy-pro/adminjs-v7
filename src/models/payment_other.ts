import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.js';

@Table({ tableName: 'payments_other' })
export class PaymentsOther extends Model<PaymentsOther> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  currency: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @Column({
    type: DataType.STRING,
  })
  utm_content: string | null;

  @BelongsTo(() => User)
  user: User;
}
