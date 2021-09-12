import { UpdaterInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOneAnnouncementRequestDto } from 'src/announcement/dto/update-one-announcement.dto';

@Injectable()
export class AnnouncementOneUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async update(bodyData: UpdateOneAnnouncementRequestDto, id: string) {
    const count = await this.announcementRepository.count({where: {top: true}})
      
    if(count >= 3 && bodyData.top) {
      throw new BadRequestException({ status: 400, message: '상위노출은 3개까지만 가능합니다.'})
    }

    const targetAnnouncement = await this.announcementRepository.findOne({
      id,
    });

    if (!targetAnnouncement) {
      throw new NotFoundException({
        status: 404,
        message: '업데이트할 공지를 찾지 못했습니다.',
      });
    }

    await this.announcementRepository.update(targetAnnouncement.id, {
      ...bodyData,
    });

    return targetAnnouncement;
  }
}
