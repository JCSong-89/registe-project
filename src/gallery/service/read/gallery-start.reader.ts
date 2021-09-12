import { ReaderInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryOrderByEnum } from '../../enum/gallery-orderby.enum';
import { File } from '../../../file/entity/file.entity';
import moment from 'moment-timezone';

@Injectable()
export class GalleryStartReader implements ReaderInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async read(query: string, orderBy: GalleryOrderByEnum) {
    return await this.galleryRepository
      .createQueryBuilder('galleries')
      .leftJoinAndMapMany(
        'galleries.files',
        File,
        'files',
        'files.fkId = galleries.id',
      )
      .where('galleries.title like :title', { title: `%${query}%` })
      .andWhere('galleries.finishedAt >= :after', {
        after: moment().format('YYYY-MM-DD'),
      })
      .orderBy('galleries.top', 'DESC')
      .addOrderBy(`galleries.${orderBy}`, 'DESC')
      .addOrderBy(`files.createdAt`, 'ASC')
      .getMany();
  }
}
