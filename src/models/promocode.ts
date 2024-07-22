import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'promo_codes' })
export class PromoCode extends Model<PromoCode> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
  })
  sale: number;
}
