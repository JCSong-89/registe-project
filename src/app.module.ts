import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm-config.service';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from './news/news.module';
import { JwtModule } from './jwt/jwt.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { AccountModule } from './account/account.module';
import { FileModule } from './file/file.module';
import { GalleryModule } from './gallery/gallery.module';
import { RegisteProjectModule } from './registe-project/registe-project.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    FileModule.forRoot({
      azureAccount: process.env.AZURE_STORAGE_ACCOUNT,
      azureSASKey: process.env.AZURE_STORAGE_SAS_KEY,
      containerName: process.env.AZURE_CONTAINER_NAME,
    }),

    AccountModule,
    AnnouncementModule,
    GalleryModule,
    NewsModule,
    RegisteProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
