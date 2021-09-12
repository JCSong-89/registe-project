import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from 'src/auth/auth.decorator';
import { MessageStatusCoreDto } from 'src/common/dto/message-status-core.dto';
import { Category } from 'src/file/enum/category.enum';
import {
  FileDeleter,
  FileUpdater,
  FileReader,
} from 'src/file/operator/file.operator';
import { FileManyMultipleDeleter } from 'src/file/service/delete/file-many-mutiple.deleter';
import { FileMultipleDeleter } from 'src/file/service/delete/file-multiple.deleter';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { FileMultipleUpdater } from 'src/file/service/update/file-multiple.updater';
import {
  CreateOneAnnouncementBodyDto,
  CreateOneAnnouncementRequestDto,
} from '../dto/create-one-announcement.dto';
import {
  ReadAnnouncementAdminResponseDto,
  ReadAnnouncementPageAdminResponseDto,
} from '../dto/read-multiple-announcement.dto';
import { ReadOneAnnouncementAdminResponseDto } from '../dto/read-one-announcement.dto';
import {
  UpdateOneAnnouncementBodyDto,
  UpdateOneAnnouncementRequestDto,
} from '../dto/update-one-announcement.dto';
import { Announcement } from '../entity/announcement.entity';
import { AnnouncementOrderByEnum } from '../enum/announcement-orderby.enum';
import {
  AnnouncementCreator,
  AnnouncementDeleter,
  AnnouncementReader,
  AnnouncementUpdater,
} from '../operator/announcement.operator';
import { AnnouncementOneCreator } from '../service/create/announcement-one.creator';
import { AnnouncementMultipleDeleter } from '../service/delete/announcement-multiple.deleter';
import { AnnouncementOneDeleter } from '../service/delete/announcement-one.deleter';
import { AnnouncementMultipleReader } from '../service/read/announcement-multiple.reader';
import { AnnouncementNormalMultipleReader } from '../service/read/announcement-normal-multiple.reader';
import { AnnouncementOneReader } from '../service/read/announcement-one.reader';
import { AnnouncementOneUpdater } from '../service/update/announcement-one.updater';

@ApiTags('공지사항 어드민')
@Controller('/v1/admin/announcements')
export class AdminAnnouncementController {
  constructor(
    private readonly announcementOneCreator: AnnouncementOneCreator,
    private readonly announcementOneReader: AnnouncementOneReader,
    private readonly announcementOneUpdater: AnnouncementOneUpdater,
    private readonly announcementOneDeleter: AnnouncementOneDeleter,
    private readonly announcementMultipleReader: AnnouncementMultipleReader,
    private readonly announcementMultipleDeleter: AnnouncementMultipleDeleter,

    private readonly announcementCreator: AnnouncementCreator,
    private readonly announcementReader: AnnouncementReader,
    private readonly announcementUpdater: AnnouncementUpdater,
    private readonly announcementDeleter: AnnouncementDeleter,

    private readonly fileMultipleReader: FileMultipleReader,
    private readonly fileMultipleUpdater: FileMultipleUpdater,
    private readonly fileMultipleDeleter: FileMultipleDeleter,
    private readonly fileManyMultipleDeleter: FileManyMultipleDeleter,

    private readonly fileReader: FileReader,
    private readonly fileUpdater: FileUpdater,
    private readonly fileDeleter: FileDeleter,
  ) {}

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @Post()
  async createOne(
    @Body() bodyData: CreateOneAnnouncementRequestDto,
    @Req() req: Request,
  ) {
    const data = new CreateOneAnnouncementBodyDto(bodyData);
    this.announcementCreator.setOperator(this.announcementOneCreator);
    const announcement = await this.announcementCreator.create(data, req);

    this.fileUpdater.setOperator(this.fileMultipleUpdater);
    const result = await this.fileUpdater.update(
      bodyData.fileIds,
      announcement.id,
      Category.NOTICE,
    );

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadOneAnnouncementAdminResponseDto })
  @Auth()
  @Get('/:announcementId')
  @ApiParam({ name: 'announcementId' })
  async getOne(@Param('announcementId') announcementId: string) {
    this.announcementReader.setOperator(this.announcementOneReader);
    const announcement = await this.announcementReader.read(announcementId);

    this.fileReader.setOperator(this.fileMultipleReader);
    const files = await this.fileReader.read(
      announcement.targetAnnouncement.id,
    );

    return new ReadOneAnnouncementAdminResponseDto(announcement, files);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadAnnouncementPageAdminResponseDto })
  @Auth()
  @Get()
  @ApiQuery({ name: 'announcementName', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({
    name: 'orderBy',
    type: 'enum',
    enum: AnnouncementOrderByEnum,
    required: false,
  })
  async getMany(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('announcementName') announcementName: string,
    @Query('orderBy') orderBy: AnnouncementOrderByEnum,
  ) {
    this.announcementReader.setOperator(this.announcementMultipleReader);
    const [announcement, count] = await this.announcementReader.read(
      announcementName || '',
      orderBy || AnnouncementOrderByEnum.CREATE,
      size || 10,
      page || 1,
    );
    const data = announcement.map((item: Announcement) => {
      return new ReadAnnouncementAdminResponseDto(item);
    });

    return new ReadAnnouncementPageAdminResponseDto(
      data,
      count,
      size || 10,
      page || 1,
    );
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'announcementId' })
  @Put(':announcementId')
  async updateOne(
    @Body() bodyData: UpdateOneAnnouncementRequestDto,
    @Param('announcementId') announcementId: string,
  ) {
    const data = new UpdateOneAnnouncementBodyDto(bodyData);
    this.announcementUpdater.setOperator(this.announcementOneUpdater);
    const announcement = await this.announcementUpdater.update(
      data,
      announcementId,
    );

    this.fileUpdater.setOperator(this.fileMultipleUpdater);
    await this.fileUpdater.update(
      bodyData.fileIds,
      announcement.id,
      Category.NOTICE,
    );

    return new MessageStatusCoreDto({ status: 200, message: '업데이트 성공' });
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @ApiParam({ name: 'announcementId' })
  @Delete(':announcementId')
  async deleteOne(@Param('announcementId') announcementId: string) {
    this.announcementDeleter.setOperator(this.announcementOneDeleter);
    await this.announcementDeleter.delete(announcementId);

    this.fileDeleter.setOperator(this.fileMultipleDeleter);
    const result = await this.fileDeleter.delete(announcementId);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiQuery({ name: 'announcementIds', required: true })
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @Delete()
  async deleteMany(@Query('announcementIds') announcementIds: string[]) {
    this.announcementDeleter.setOperator(this.announcementMultipleDeleter);
    await this.announcementDeleter.delete(announcementIds);

    this.fileDeleter.setOperator(this.fileManyMultipleDeleter);
    const result = await this.fileDeleter.delete(announcementIds);

    return new MessageStatusCoreDto(result);
  }
}
