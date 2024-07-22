import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'debts' })
export class Debts extends Model<Debts> {
  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  referrer_id?: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  rates_alias?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  debt_id: string;
}
