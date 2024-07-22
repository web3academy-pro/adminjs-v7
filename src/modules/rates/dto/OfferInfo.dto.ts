export default class OfferInfoDto {
  isSubscribe: boolean;
  subscription_days: number;
  offer_alias: string;
  isRate: boolean;
  name: string;

  constructor(rate) {
    this.isSubscribe = rate.isSubscribe;
    this.isRate = rate.isRate;
    this.offer_alias = rate.alias;
    this.subscription_days = rate.subscription_days;
    this.name = rate.descriptionInCard;
  }
}
