import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Role } from './role.js';
import { Payment } from './payment.js';
import { Referral } from './referral.js';

interface UserCreationAttrs {
  email: string;
  password: string;
  account_id: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActivated: boolean;

  @Column({
    type: DataType.TEXT,
    defaultValue: null,
  })
  confirm_token: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: null,
    unique: true,
  })
  account_id: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: null,
  })
  metamask_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: null,
  })
  discord_id: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null,
  })
  telegram: string;

  @BelongsTo(() => Role, { foreignKey: 'user_roles' })
  roles: Role;
  @Column
  user_roles: number;

  //

  // @HasMany(() => Payment)
  // payments: Payment[];

  // не работает сука эта связь
  //   @HasMany(() => Subscription)
  //   subscriptions: Subscription[];

  //   @HasMany(() => SubscriptionsCrypto)
  //   subscriptionsCrypto: SubscriptionsCrypto[];

  //   @HasMany(() => PaymentsDebt)
  //   paymentsDebts: PaymentsDebt[];

  //   @HasMany(() => Referral)
  //   referrals: Referral[];

  // @HasOne(() => MintedNFT)
  // mintedNft: MintedNFT;

  days_left: number;
  subscribe_status: string;
  can_to_subscribe: boolean;
  rates_name: string;

  @BeforeUpdate
  static async hashPasswordUpdate(instance: User, options): Promise<void> {
    if (options.fields.includes('password') && options.fields.includes('id')) {
      const salt = await bcrypt.genSalt();
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  @BeforeCreate
  static async hashPasswordCreate(instance: User, options): Promise<void> {
    if (options.fields.includes('password')) {
      const salt = await bcrypt.genSalt();
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
