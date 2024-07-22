import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.js';

interface ReferrerIncomeCreateAttr {
  user_id: number;
  total: number;
  available: number;
}

@Table({ tableName: 'referrer_income' })
export class ReferrerIncome extends Model<
  ReferrerIncome,
  ReferrerIncomeCreateAttr
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
  })
  total: number;

  @Column({
    type: DataType.DOUBLE,
  })
  available: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
