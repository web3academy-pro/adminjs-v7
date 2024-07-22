import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from './user.js';
interface InterfaceCreate {
  user_id: number;
  amount: number;
}

enum PaymentsOutStatusEnum {
  Pending = 'Pending',
  Cancelled = 'Cancelled',
  Success = 'Success',
}

@Table({ tableName: 'payments_out' })
export class PaymentsOut extends Model<PaymentsOut, InterfaceCreate> {
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
    type: DataType.ENUM(...Object.values(PaymentsOutStatusEnum)),
    defaultValue: PaymentsOutStatusEnum.Pending,
  })
  status: PaymentsOutStatusEnum;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
