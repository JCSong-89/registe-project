import { ReaderInterface } from '../../operator/operator.interface';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/announcement/entity/announcement.entity';

@Injectable()
export class AnnouncementTopGetter implements ReaderInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async read() {
    return await this.announcementRepository
      .createQueryBuilder('announcements')
      .where('announcements.top = :top', {top: true})
      .orderBy(`announcements.updatedAt`, 'DESC')
      .take(3)
      .getMany()
  }
}
