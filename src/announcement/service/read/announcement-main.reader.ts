import { ReaderInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnnouncementMainReader implements ReaderInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async read(_, __, num: number) {
    return await this.announcementRepository.find({
      where: {top: false},
      order: { createdAt: 'DESC' },
      take: num,
    });
  }
}
