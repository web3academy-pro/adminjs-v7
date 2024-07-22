import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.js';

@Table({ tableName: 'payments_debt' })
export class PaymentsDebt extends Model<PaymentsDebt> {
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
    type: DataType.STRING,
  })
  invoice_id: string;

  @Column({
    type: DataType.STRING,
  })
  currency: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  offer_alias: string | null;

  @Column({
    type: DataType.STRING,
  })
  utm_content: string | null;

  @BelongsTo(() => User)
  user: User;
}
