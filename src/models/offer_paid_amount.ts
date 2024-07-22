import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'offer_paid_amount' })
export class OfferPaidAmount extends Model<OfferPaidAmount> {
  @Column({ type: DataType.STRING, allowNull: false })
  offer_alias: string;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;
}
