import { Announcement } from '../entity/announcement.entity';
import { ReadAnnouncementServiceResponseDto } from './read-multiple-announcement.dto';

export class ReadMainAnnouncementServiceResponseDto extends ReadAnnouncementServiceResponseDto {
  constructor(data: Announcement) {
    super(data);
  }
}
