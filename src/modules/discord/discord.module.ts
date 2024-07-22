import { Module, forwardRef } from '@nestjs/common';
import { DiscordService } from './discord.service.js';
import { RatesModule } from '../rates/rates.module.js';

@Module({
  providers: [DiscordService],
  imports: [forwardRef(() => RatesModule)],
  exports: [DiscordService],
})
export class DiscordModule {}
