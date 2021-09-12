import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGalleryController } from './controller/admin_gallery.controller';
import { Gallery } from './entity/gallery.entity';
import { GalleryOneCreator } from './service/create/gallery-one.creator';
import { ServiceGalleryController } from './controller/servcie_gallery.controller';
import {
  GalleryCreator,
  GalleryDeleter,
  GalleryReader,
  GalleryUpdater,
} from './operator/gallery.operator';
import { GalleryOneUpdater } from './service/update/gallery-one.updater';
import { GalleryOneDeleter } from './service/delete/gallery-one.deleter';
import { GalleryMultipleDeleter } from './service/delete/gallery-multiple.deleter';
import { GalleryOneReader } from './service/read/gallery-one.reader';
import { GalleryMultipleReader } from './service/read/gallery-multiple.reader';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { AccountOneReader } from 'src/account/service/read/account-one.reader';
import {
  AccountReader,
  AccountUpdater,
} from 'src/account/operator/acccount.operator';
import { Account } from 'src/account/entity/account.entity';
import { AccountLastestUpdater } from 'src/account/service/update/account-lastest.updater';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { FileMultipleUpdater } from 'src/file/service/update/file-multiple.updater';
import { FileUpdater, FileReader } from 'src/file/operator/file.operator';
import { File } from '../file/entity/file.entity';
import { GalleryStartReader } from './service/read/gallery-start.reader';
import { GalleryNormalMultipleReader } from './service/read/gallery-normal-multiple.reader';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, Account, File])],
  controllers: [AdminGalleryController, ServiceGalleryController],
  providers: [
    GalleryCreator,
    GalleryReader,
    GalleryUpdater,
    GalleryDeleter,

    GalleryOneCreator,
    GalleryOneReader,
    GalleryOneUpdater,
    GalleryOneDeleter,

    GalleryStartReader,
    GalleryNormalMultipleReader,
    GalleryMultipleReader,
    GalleryMultipleDeleter,

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
export class GalleryModule {}
