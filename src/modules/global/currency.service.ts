import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CurrencyConverterService {
  lastUSD_RUBCourse = 0.0135383;

  async convertRUBtoUSDT(amount_rub: number): Promise<number> {
    try {
      const response = await axios.get(
        'https://www.cbr-xml-daily.ru/latest.js',
      );
      this.lastUSD_RUBCourse = response.data.rates.USD;
    } catch (e) {
      console.log(e);
    }
    return +(amount_rub * this.lastUSD_RUBCourse);
  }
}
