import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Account } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Account])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 