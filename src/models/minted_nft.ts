import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.js';

@Table({ tableName: 'minted_nft' })
export class MintedNFT extends Model<MintedNFT> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, unique: true })
  user_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  tx_hash: string | null;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt: Date;

  @BelongsTo(() => User)
  user: User;
}
