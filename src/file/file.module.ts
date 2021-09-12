import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtOperater } from 'src/jwt/jwt.operator';
import { AccountOneReader } from 'src/account/service/read/account-one.reader';
import {
  AccountReader,
  AccountUpdater,
} from 'src/account/operator/acccount.operator';
import { Account } from 'src/account/entity/account.entity';
import { AccountLastestUpdater } from 'src/account/service/update/account-lastest.updater';
import { File } from './entity/file.entity';
import { FileModuleOptions } from './file.inferface';
import { ConfigOptions } from 'src/common/enum/config-option.enm';
import {
  FileCreator,
  FileDeleter,
  FileManyCreator,
} from './operator/file.operator';
import { FileOneCreator } from './service/create/file-one.creator';
import { FileOneDeleter } from './service/delete/file-one.deleter';
import { FileController } from './file.controller';
import { FileMultipleDeleter } from './service/delete/file-multiple.deleter';
import { FileManyMultipleDeleter } from './service/delete/file-many-mutiple.deleter';
import { FileMultipleCreator } from './service/create/file-multiple.creator';

@Global()
@Module({})
export class FileModule {
  static forRoot(options: FileModuleOptions): DynamicModule {
    return {
      module: FileModule,
      controllers: [FileController],
      imports: [TypeOrmModule.forFeature([File, Account])],
      providers: [
        {
          provide: ConfigOptions.FILE,
          useValue: options,
        },
        FileOneCreator,
        FileOneDeleter,
        FileMultipleCreator,
        FileMultipleDeleter,
        FileManyMultipleDeleter,
        FileDeleter,
        FileCreator,
        FileManyCreator,
        AccountOneReader,
        AccountReader,
        AccountLastestUpdater,
        AccountUpdater,
        JwtOperater,
      ],
      exports: [
        FileOneCreator,
        FileCreator,
        FileManyCreator,
        FileMultipleCreator,
        FileOneDeleter,
        FileMultipleDeleter,
        FileManyMultipleDeleter,
        FileDeleter,
      ],
    };
  }
}
