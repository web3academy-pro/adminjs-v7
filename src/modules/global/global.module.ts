import { Global, Module } from '@nestjs/common';
import { CurrencyConverterService } from './currency.service.js';
import UniSender from 'unisender';
import { Clients } from './global.consts.js';

const globalProviders = [
  CurrencyConverterService,
  {
    provide: Clients.UniSenderClients,
    useFactory: (client) =>
      new UniSender({
        api_key: '6xgkjn4f8ig7uzbary1mbicaifq8ns8p15yfwnza',
        lang: 'ru',
      }),
  },
];

@Global()
@Module({
  providers: globalProviders,
  exports: [...globalProviders],
})
export class GlobalModule {}
