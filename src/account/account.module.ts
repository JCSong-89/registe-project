import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { AccountController } from './account.controller';
import { Account } from './entity/account.entity';
import {
  AccountCreator,
  AccountDeleter,
  AccountReader,
  AccountUpdater,
} from './operator/acccount.operator';
import { AccountOneCreator } from './service/create/account-one.creator';
import { AccountOneDeleter } from './service/delete/acccount-one.deleter';
import { AccountMultipleDeleter } from './service/delete/account-multiple.deleter';
import { AccountMultipleReader } from './service/read/account-multiple.reader';
import { AccountOneReader } from './service/read/account-one.reader';
import { AccountCertUpdater } from './service/update/account-cert.updater';
import { AccountLastestUpdater } from './service/update/account-lastest.updater';
import { AccountOneUpdater } from './service/update/account-one.updater';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [
    AccountCreator,
    AccountReader,
    AccountUpdater,
    AccountDeleter,

    AccountOneCreator,
    AccountOneReader,
    AccountOneUpdater,
    AccountOneDeleter,

    AccountMultipleDeleter,
    AccountMultipleReader,
    AccountLastestUpdater,
    AccountCertUpdater,
    JwtOperater,
  ],
  exports: [TypeOrmModule],
})
export class AccountModule {}
