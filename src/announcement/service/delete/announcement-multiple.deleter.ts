import { DeleterInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { In, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnnouncementMultipleDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async delete(ids: string[] | string) {
    let idsArray = [];
    if (typeof ids !== 'object') {
      idsArray.push(ids);
    } else {
      idsArray = ids;
    }

    const targetAnnouncements = await this.announcementRepository.find({
      where: {
        id: In(idsArray),
      },
    });

    if (targetAnnouncements.length === 0) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 뉴스를 찾지 못했습니다.',
      });
    }

    await this.announcementRepository.remove(targetAnnouncements);
    const checkDeleted = await this.announcementRepository.find({
      where: {
        id: In(idsArray),
      },
    });

    if (checkDeleted.length !== 0) {
      throw new InternalServerErrorException({
        status: 500,
        message: '삭제 시도한 뉴스가 삭제 되지 않았습니다..',
      });
    }

    return { status: 200, message: 'success' };
  }
}
