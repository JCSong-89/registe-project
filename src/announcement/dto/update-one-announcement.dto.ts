import {
  CreateOneAnnouncementBodyDto,
  CreateOneAnnouncementRequestDto,
} from './create-one-announcement.dto';

export class UpdateOneAnnouncementRequestDto extends CreateOneAnnouncementRequestDto {}

export class UpdateOneAnnouncementBodyDto extends CreateOneAnnouncementBodyDto {
  constructor(data) {
    super(data);
  }
}
