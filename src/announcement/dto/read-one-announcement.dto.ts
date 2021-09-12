import { Announcement } from '../entity/announcement.entity';
import { File } from '../../file/entity/file.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ReadOneAnnouncementCore {
  @ApiResponseProperty()
  title: string;
  @ApiResponseProperty()
  content: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  top: boolean;
  @ApiResponseProperty({ type: [File] })
  files: File[];

  constructor(data: Announcement, files: File[]) {
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.files = files;
    this.top = data.top
  }
}

export class ReadOneAnnouncementServiceResponseDto extends ReadOneAnnouncementCore {
  @ApiResponseProperty()
  next: string;
  @ApiResponseProperty()
  prev: string;

  constructor(
    data: Announcement,
    next: string | null,
    prev: string | null,
    files: File[],
  ) {
    super(data, files);
    this.next = next;
    this.prev = prev;
  }
}

export class ReadOneAnnouncementAdminResponseDto extends ReadOneAnnouncementCore {
  @ApiResponseProperty()
  top: boolean;
  @ApiResponseProperty()
  id: string;

  constructor(data: any, files: File[]) {
    super(data.targetAnnouncement, files);
    this.id = data.targetAnnouncement.id;
    this.top = data.targetAnnouncement.top;
  }
}
