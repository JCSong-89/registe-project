import { ReaderInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnouncementOrderByEnum } from 'src/announcement/enum/announcement-orderby.enum';

@Injectable()
export class AnnouncementNormalMultipleReader implements ReaderInterface {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async read(
    query: string,
    orderBy: AnnouncementOrderByEnum,
    size: number,
    page: number,
  ) {
    let by: 'DESC' | 'ASC' = 'ASC';

    if (orderBy === AnnouncementOrderByEnum.CREATE) by = 'DESC';

    return await this.announcementRepository
      .createQueryBuilder('announcements')
      .leftJoinAndSelect('announcements.account', 'accounts')
      .where('announcements.title like :title', { title: `%${query}%` })
      .andWhere('announcements.top = :top', {top: false})
      .orderBy(`announcements.${orderBy}`, by)
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }
}
