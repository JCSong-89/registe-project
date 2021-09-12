import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationCore } from 'src/common/pagination_core';
import { Announcement } from '../entity/announcement.entity';

export class ReadAnnouncementServiceResponseDto {
  @ApiResponseProperty()
  announcementId: string;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  createdAt: Date;


  @ApiResponseProperty()
  top: boolean;

  constructor(data: Announcement) {
    this.announcementId = data.id;
    this.title = data.title;
    this.createdAt = data.createdAt;
    this.top = data.top
  }
}

export class ReadAnnouncementPageServiceResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadAnnouncementServiceResponseDto] })
  data: ReadAnnouncementServiceResponseDto[];

  constructor(
    data: ReadAnnouncementServiceResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}

export class ReadAnnouncementAdminResponseDto extends ReadAnnouncementServiceResponseDto {
  @ApiResponseProperty()
  registe: string;

  constructor(data: Announcement) {
    super(data);
    this.registe = data.account.email;
  }
}

export class ReadAnnouncementPageAdminResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadAnnouncementAdminResponseDto] })
  data: ReadAnnouncementAdminResponseDto[];

  constructor(
    data: ReadAnnouncementAdminResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}
