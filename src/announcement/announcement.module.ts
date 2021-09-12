import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import {
  AccountReader,
  AccountUpdater,
} from 'src/account/operator/acccount.operator';
import { AccountOneReader } from 'src/account/service/read/account-one.reader';
import { AccountLastestUpdater } from 'src/account/service/update/account-lastest.updater';
import { File } from '../file/entity/file.entity';
import { FileUpdater, FileReader } from 'src/file/operator/file.operator';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { FileMultipleUpdater } from 'src/file/service/update/file-multiple.updater';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { AdminAnnouncementController } from './controller/admin-announcement.controller';
import { ServiceAnnouncementController } from './controller/servcie-announcement.controller';
import { Announcement } from './entity/announcement.entity';
import {
  AnnouncementCreator,
  AnnouncementDeleter,
  AnnouncementReader,
  AnnouncementUpdater,
} from './operator/announcement.operator';
import { AnnouncementOneCreator } from './service/create/announcement-one.creator';
import { AnnouncementMultipleDeleter } from './service/delete/announcement-multiple.deleter';
import { AnnouncementOneDeleter } from './service/delete/announcement-one.deleter';
import { AnnouncementMainReader } from './service/read/announcement-main.reader';
import { AnnouncementMultipleReader } from './service/read/announcement-multiple.reader';
import { AnnouncementOneReader } from './service/read/announcement-one.reader';
import { AnnouncementOneUpdater } from './service/update/announcement-one.updater';
import { AnnouncementNormalMultipleReader } from './service/read/announcement-normal-multiple.reader';
import { AnnouncementTopGetter } from './service/read/announcement-top-getter.reader';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, Account, File])],
  controllers: [AdminAnnouncementController, ServiceAnnouncementController],
  providers: [
    AnnouncementCreator,
    AnnouncementReader,
    AnnouncementUpdater,
    AnnouncementDeleter,

    AnnouncementMainReader,

    AnnouncementOneCreator,
    AnnouncementOneReader,
    AnnouncementOneUpdater,
    AnnouncementOneDeleter,

    AnnouncementMultipleReader,
    AnnouncementNormalMultipleReader,
    AnnouncementTopGetter,
    AnnouncementMultipleDeleter,

    FileMultipleReader,
    FileMultipleUpdater,

    FileReader,
    FileUpdater,

    AccountOneReader,
    AccountReader,
    AccountLastestUpdater,
    AccountUpdater,
    JwtOperater,
  ],
  exports: [TypeOrmModule],
})
export class AnnouncementModule {}
