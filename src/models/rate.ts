import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.js';

export enum RateStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
}

export const NEW_START_DATE = new Date('2023-12-16');
export const STUDYING_START_DATE = new Date('2024-01-08 16:00');

const now = new Date();

@Table({ tableName: 'rates' })
export class Rate extends Model<Rate> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  offer_alias: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  frozen_until: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(RateStatus)),
    defaultValue: RateStatus.Active,
  })
  status: RateStatus;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  isCanViewContent() {
    const now = new Date();

    const rateCreatedDate = new Date(this.createdAt);

    if (this.frozen_until) {
      const frozenUntil = new Date(this.frozen_until);

      if (frozenUntil > now) {
        return false;
      }
    }

    return !(rateCreatedDate >= NEW_START_DATE && now < STUDYING_START_DATE);
  }
}
