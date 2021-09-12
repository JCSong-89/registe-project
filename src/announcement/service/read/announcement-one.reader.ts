import { ReaderInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnnouncementOneReader implements ReaderInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async read(id: string) {
    const targetAnnouncement = await this.announcementRepository.findOne({
      id,
    });

    if (!targetAnnouncement) {
      throw new NotFoundException({
        status: 404,
        message: '조회 데이터를 찾지 못했습니다.',
      });
    }

    const nextAnnouncement = await this.announcementRepository.find({
      where: { idx: MoreThan(targetAnnouncement.idx) },
      select: ['id'],
      order: { idx: 'ASC' },
      take: 1,
    });
    const prevAnnouncement = await this.announcementRepository.find({
      where: { idx: LessThan(targetAnnouncement.idx) },
      select: ['id'],
      order: { idx: 'DESC' },
      take: 1,
    });
    const next = nextAnnouncement.length != 0 ? nextAnnouncement[0].id : null;
    const prev = prevAnnouncement.length != 0 ? prevAnnouncement[0].id : null;

    return { targetAnnouncement, next, prev };
  }
}
