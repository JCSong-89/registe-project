import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccountReader,
  AccountUpdater,
} from 'src/account/operator/acccount.operator';
import { AccountOneReader } from 'src/account/service/read/account-one.reader';
import { AccountLastestUpdater } from 'src/account/service/update/account-lastest.updater';
import { FileManyCreator, FileReader } from 'src/file/operator/file.operator';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { ServiceRegisteProjectController } from './controller/service-registe-project.controller';
import { RegisteProject } from './entity/registe-project.entity';
import { File } from '../file/entity/file.entity';
import { Account } from 'src/account/entity/account.entity';
import { RegisteProjectOneCreator } from './service/create/registe-project-one.creator';
import { RegisteProjectCreator, RegisteProjectReader } from './operator/registe-project.operator';
import { AdminRegisteProjectController } from './controller/admin-registe-project.controller';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { RegisteProjectOneReader } from './service/read/registe-project-one.reader';
import { RegisteProjectMultipleReader } from './service/read/registe-project-multiple.reader';
import { RegisteProjectAllReader } from './service/read/registe-project-all-reader';
import { AccountCertAdminReader } from 'src/account/service/read/account-cert-admin.reader';

@Module({
  imports: [TypeOrmModule.forFeature([Account, File, RegisteProject])],
  controllers: [ServiceRegisteProjectController, AdminRegisteProjectController],
  providers: [
    RegisteProjectOneReader,
    RegisteProjectMultipleReader,
    RegisteProjectOneCreator,
    RegisteProjectCreator,
    RegisteProjectReader,
    RegisteProjectAllReader,

    FileManyCreator,
    FileReader,
    FileMultipleReader,

    AccountOneReader,
    AccountReader,
    AccountLastestUpdater,
    AccountUpdater,
    AccountCertAdminReader,
    JwtOperater,
  ],
  exports: [TypeOrmModule],
})
export class RegisteProjectModule {}
