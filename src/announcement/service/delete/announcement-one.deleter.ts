import { DeleterInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnnouncementOneDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async delete(id: string) {
    const targetAnnouncement = await this.announcementRepository.findOne({
      id,
    });

    if (!targetAnnouncement) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 뉴스를 찾지 못했습니다.',
      });
    }

    await this.announcementRepository.remove(targetAnnouncement);
    const checkDeleted = await this.announcementRepository.findOne({ id });

    if (checkDeleted) {
      throw new InternalServerErrorException({
        status: 500,
        message: '삭제 시도한 뉴스가 삭제 되지 않았습니다..',
      });
    }

    return { status: 200, message: 'success' };
  }
}
