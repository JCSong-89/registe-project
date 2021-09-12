import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminNewsController } from './controller/admin_news.controller';
import { News } from './entity/news.entity';
import { NewsOneCreator } from './service/create/news-one.creator';
import { ServiceNewsController } from './controller/servcie_news.controller';
import {
  NewsCreator,
  NewsDeleter,
  NewsReader,
  NewsUpdater,
} from './operator/news.operator';
import { NewsOneUpdater } from './service/update/news-one.updater';
import { NewsOneDeleter } from './service/delete/news-one.deleter';
import { NewsMultipleDeleter } from './service/delete/news-multiple.deleter';
import { NewsOneReader } from './service/read/news-one.reader';
import { NewsMultipleReader } from './service/read/news-multiple.reader';
import { NewsMainReader } from './service/read/news-main.reader';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { AccountOneReader } from 'src/account/service/read/account-one.reader';
import {
  AccountReader,
  AccountUpdater,
} from 'src/account/operator/acccount.operator';
import { Account } from 'src/account/entity/account.entity';
import { AccountLastestUpdater } from 'src/account/service/update/account-lastest.updater';
import { NewsNormalMultipleReader } from './service/read/news-normal-multiple.reader';
import { NewsTopGetter } from './service/read/news-top-getter.reader';

@Module({
  imports: [TypeOrmModule.forFeature([News, Account])],
  controllers: [AdminNewsController, ServiceNewsController],
  providers: [
    NewsCreator,
    NewsReader,
    NewsUpdater,
    NewsDeleter,

    NewsMainReader,

    NewsOneCreator,
    NewsOneReader,
    NewsOneUpdater,
    NewsOneDeleter,

    NewsNormalMultipleReader,
    NewsMultipleReader,
    NewsTopGetter,
    NewsMultipleDeleter,

    AccountOneReader,
    AccountReader,
    AccountLastestUpdater,
    AccountUpdater,
    JwtOperater,
  ],
  exports: [TypeOrmModule],
})
export class NewsModule {}
