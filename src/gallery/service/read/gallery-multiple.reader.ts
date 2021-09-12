import { ReaderInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryOrderByEnum } from '../../enum/gallery-orderby.enum';
import { File } from '../../../file/entity/file.entity';
@Injectable()
export class GalleryMultipleReader implements ReaderInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async read(
    query: string,
    orderBy: GalleryOrderByEnum,
    size: number,
    page: number,
  ) {
    let by: 'DESC' | 'ASC' = 'ASC';

    if (orderBy === GalleryOrderByEnum.CREATE) by = 'DESC';

    return await this.galleryRepository
      .createQueryBuilder('galleries')
      .leftJoinAndMapMany(
        'galleries.files',
        File,
        'files',
        'files.fkId = galleries.id',
      )
      .where('galleries.title like :title', { title: `%${query}%` })
      .orderBy('galleries.top', 'DESC')
      .addOrderBy(`galleries.${orderBy}`, by)
      .addOrderBy(`files.createdAt`, 'ASC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }
}
