export default class OfferRulesDto {
  available_categories: string[];
  available_days: number;
  available_nft: boolean;
  can_to_subscribe: boolean;
  discord_role: string;
  full_access: boolean;
  unisender_group: string;

  constructor(rate) {
    this.available_days = rate.available_days;
    this.available_nft = rate.available_nft;
    this.can_to_subscribe = rate.can_to_subscribe;
    this.discord_role = rate.discord_role;
    this.full_access = rate.full_access;
    this.unisender_group = rate.unisender_group;
    this.available_categories = rate.available_categories.data.map(v => v.attributes.alias);
  }
}
