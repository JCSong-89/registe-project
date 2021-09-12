import { ReaderInterface } from '../../operator/operator.interface';
import { Announcement } from '../../entity/announcement.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnouncementOrderByEnum } from 'src/announcement/enum/announcement-orderby.enum';

@Injectable()
export class AnnouncementMultipleReader implements ReaderInterface {
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
      .orderBy('announcements.top', 'DESC')
      .addOrderBy(`announcements.${orderBy}`, by)
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }
}
