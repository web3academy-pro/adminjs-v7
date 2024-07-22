import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum CryptoCurrencyEnum {
  USDT = 'USDT',
  USDC = 'USDC',
}

export enum BlockchainNetworkEnum {
  BSC = 'BSC',
  ETHEREUM = 'ETHEREUM',
  ARBITRUM = 'ARBITRUM',
  AVALANCHE = 'AVALANCHE',
  // POLYGON = 'POLYGON',
}

export enum CryptoPaymentStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

@Table({ tableName: 'payments_crypto' })
export class PaymentsCrypto extends Model<PaymentsCrypto> {
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
  tx_hash: string;

  @Column({
    type: DataType.ENUM(...Object.values(CryptoCurrencyEnum)),
  })
  currency: CryptoCurrencyEnum;

  @Column({
    type: DataType.ENUM(...Object.values(BlockchainNetworkEnum)),
  })
  network: BlockchainNetworkEnum;

  @Column({
    type: DataType.ENUM(...Object.values(CryptoPaymentStatus)),
    defaultValue: CryptoPaymentStatus.PENDING,
  })
  status: CryptoPaymentStatus;

  @Column({
    type: DataType.STRING,
  })
  from: string;

  @Column({
    type: DataType.STRING,
  })
  offer_alias: string;

  @Column({
    type: DataType.INTEGER,
  })
  referrer_id: number;

  @Column({
    type: DataType.STRING,
  })
  email: string;
}
