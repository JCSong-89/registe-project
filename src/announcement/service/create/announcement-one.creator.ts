import { CreatorInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { Repository } from 'typeorm';

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOneAnnouncementRequestDto } from 'src/announcement/dto/create-one-announcement.dto';
import { throws } from 'assert';

@Injectable()
export class AnnouncementOneCreator implements CreatorInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(bodyData: CreateOneAnnouncementRequestDto, req: any) {
    const count = await this.announcementRepository.count({where: {top: true}})
      
    if(count >= 3 && bodyData.top) {
      throw new BadRequestException({ status: 400, message: '상위노출은 3개까지만 가능합니다.'})
    }

    const createAnnouncement = this.announcementRepository.create({
      ...bodyData,
      account: req.admin,
    });
    const announcement = await this.announcementRepository.save(
      createAnnouncement,
    );

    if (!announcement) {
      throw new InternalServerErrorException({
        status: 500,
        message: '공지사항이 생성이 되지 않았습니다.',
      });
    }

    return announcement;
  }
}
