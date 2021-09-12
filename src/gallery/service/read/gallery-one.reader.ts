import { ReaderInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GalleryOneReader implements ReaderInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async read(id: string) {
    const targetGallery = await this.galleryRepository.findOne({ id });

    if (!targetGallery) {
      throw new NotFoundException({
        status: 404,
        message: '조회 데이터를 찾지 못했습니다.',
      });
    }

    return targetGallery;
  }
}
