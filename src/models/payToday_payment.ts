import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum PaytodayStatus {
  NOT_PAID = 'NOT_PAID',
  PAID = 'PAID',
}
@Table({ tableName: 'paytoday_payments' })
export class PaytodayPayments extends Model<PaytodayPayments> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_data: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PaytodayStatus),
    allowNull: false,
    defaultValue: PaytodayStatus.NOT_PAID,
  })
  status: PaytodayStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  invoice_id: string | null;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  amount_usd: number | null;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount_rub: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paid_at: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  referrer_id: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  offer_alias: string;
}
