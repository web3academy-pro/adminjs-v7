import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UnisenderService } from './unisender.service.js';

@Module({
  imports: [ConfigModule],
  providers: [UnisenderService],
  exports: [UnisenderService],
})
export class EmailModule {}
