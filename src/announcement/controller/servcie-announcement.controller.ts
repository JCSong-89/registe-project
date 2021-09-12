import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { ReadMainAnnouncementServiceResponseDto } from '../dto/read-main-announcement.dto';
import {
  ReadAnnouncementPageServiceResponseDto,
  ReadAnnouncementServiceResponseDto,
} from '../dto/read-multiple-announcement.dto';
import { ReadOneAnnouncementServiceResponseDto } from '../dto/read-one-announcement.dto';
import { Announcement } from '../entity/announcement.entity';
import { AnnouncementOrderByEnum } from '../enum/announcement-orderby.enum';
import { AnnouncementReader } from '../operator/announcement.operator';
import { AnnouncementMainReader } from '../service/read/announcement-main.reader';
import { AnnouncementMultipleReader } from '../service/read/announcement-multiple.reader';
import { AnnouncementOneReader } from '../service/read/announcement-one.reader';
import { FileReader } from 'src/file/operator/file.operator';
import { AnnouncementNormalMultipleReader } from '../service/read/announcement-normal-multiple.reader';
import { AnnouncementTopGetter } from '../service/read/announcement-top-getter.reader';

@ApiTags('공지사항 서비스')
@Controller('/v1/service/announcements')
export class ServiceAnnouncementController {
  constructor(
    private readonly announcementMainReader: AnnouncementMainReader,
    private readonly announcementOneReader: AnnouncementOneReader,
    private readonly announcementNormalMultipleReader: AnnouncementNormalMultipleReader,
    private readonly announcementTopGetter: AnnouncementTopGetter,
    private readonly announcementReader: AnnouncementReader,

    private readonly fileMultipleReader: FileMultipleReader,
    private readonly fileReader: FileReader,
  ) {}
  
  @Get('top-announcements')
  async getAnnouncementTop(){
    this.announcementReader.setOperator(this.announcementTopGetter);
    const topAnnouncements = await this.announcementReader.read();
    const count = topAnnouncements.length

    return {topAnnouncements, count}
  }

  @ApiOkResponse({ type: [ReadMainAnnouncementServiceResponseDto] })
  @Get('main')
  async getMain() {
    const {topAnnouncements, count} = await this.getAnnouncementTop()
    const normalAnnouncementGetnum = 5 - count

    this.announcementReader.setOperator(this.announcementMainReader);
    const announcements = await this.announcementReader.read(null, null, normalAnnouncementGetnum);

    const totalAnnouncements = [...topAnnouncements, ...announcements]

    const data = totalAnnouncements.map((item: Announcement) => {
      return new ReadMainAnnouncementServiceResponseDto(item);
    });

    return data;
  }

  @Get(':announcementId')
  @ApiOkResponse({ type: ReadOneAnnouncementServiceResponseDto })
  @ApiParam({ name: 'announcementId' })
  async getOne(@Param('announcementId') announcementId: string) {
    this.announcementReader.setOperator(this.announcementOneReader);
    const {
      targetAnnouncement,
      next,
      prev,
    } = await this.announcementReader.read(announcementId);

    this.fileReader.setOperator(this.fileMultipleReader);
    const files = await this.fileReader.read(targetAnnouncement.id);

    return new ReadOneAnnouncementServiceResponseDto(
      targetAnnouncement,
      next,
      prev,
      files,
    );
  }

  @Get()
  @ApiOkResponse({ type: ReadAnnouncementPageServiceResponseDto })
  @ApiQuery({ name: 'announcementName', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getMany(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('announcementName') announcementName: string,
  ) {
    this.announcementReader.setOperator(this.announcementNormalMultipleReader);
    const [announcement, count] = await this.announcementReader.read(
      announcementName || '',
      AnnouncementOrderByEnum.CREATE,
      size || 10,
      page || 1,
    );
    const data = announcement.map((item: Announcement) => {
      return new ReadAnnouncementServiceResponseDto(item);
    });

    return new ReadAnnouncementPageServiceResponseDto(
      data,
      count,
      size || 10,
      page | 1,
    );
  }

}
