import { Global, Module } from '@nestjs/common';
import { CrmService } from './crm.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Debts } from '../../models/debt.js';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Debts])],
  controllers: [],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
