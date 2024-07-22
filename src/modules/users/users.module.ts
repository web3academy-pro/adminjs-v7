import { forwardRef, Global, Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service.js';
import { User } from '../../models/user.js';
import { Role } from '../../models/role.js';

@Global()
@Module({
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    // RolesModule,
    // forwardRef(() => DiscordModule),
    // NftModule,
    // EmailModule,
  ],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {}
  // constructor(private usersService: UsersService) {}

  // async onModuleInit() {
  //   const userExists = await this.usersService.findByEmail(
  //     process.env.ADMIN_EMAIL,
  //   );
  //   if (userExists) {
  //     await this.usersService.updateUser({
  //       id: userExists.id,
  //       password: process.env.ADMIN_PASSWORD,
  //     });
  //   } else {
  //     const user = await this.usersService.createUser({
  //       email: process.env.ADMIN_EMAIL,
  //       password: process.env.ADMIN_PASSWORD,
  //       isActivated: true,
  //       role: RolesTypes.ADMIN,
  //     });
  //   }
  // }
}
