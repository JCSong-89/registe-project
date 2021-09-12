import { ReaderInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryOrderByEnum } from '../../enum/gallery-orderby.enum';
import { File } from '../../../file/entity/file.entity';
@Injectable()
export class GalleryNormalMultipleReader implements ReaderInterface {
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
    let by: 'DESC' | 'ASC' = 'DESC';

    if (orderBy === GalleryOrderByEnum.TITLE) by = 'ASC';

    const galleries = await this.galleryRepository
      .createQueryBuilder('galleries')
      .leftJoinAndMapMany(
        'galleries.files',
        File,
        'files',
        'files.fkId = galleries.id',
      )
      .where('galleries.title like :title', { title: `%${query}%` })
      .orderBy(`galleries.${orderBy}`, by)
      .addOrderBy(`files.createdAt`, 'ASC')
      .getMany();

    const pagination = [];
    const count = galleries.length;
    const skipValue = size * (page - 1);
    const limitValue = size * page;

    if (count > size * page) {
      if (page != 1 && count > limitValue) {
        for (let i = 0; i < size; i++) {
          pagination.push(galleries[skipValue + i]);
        }
      } else if (page == 1 && count >= limitValue) {
        for (let i = 0; i < size; i++) {
          pagination.push(galleries[i]);
        }
      } else if (page == 1 && count <= limitValue) {
        for (let i = 0; i < count; i++) {
          pagination.push(galleries[i]);
        }
      } else {
        for (let i = 0; i < size - (limitValue - count); i++) {
          pagination.push(galleries[skipValue + i]);
        }
      }
    } else {
      const loopValue = size - (limitValue - count);

      for (let i = 0; i < loopValue; i++) {
        pagination.push(galleries[skipValue + i]);
      }
    }

    return { pagination, count };
  }
}
