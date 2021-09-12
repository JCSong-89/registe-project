import { CreatorInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOneGalleryRequestDto } from 'src/gallery/dto/create-one-gallery.dto';

@Injectable()
export class GalleryOneCreator implements CreatorInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async create(bodyData: CreateOneGalleryRequestDto) {
    const { title, content, startedAt, top, finishedAt } = bodyData;
    const createGallery = this.galleryRepository.create({
      title,
      content,
      startedAt,
      top,
      finishedAt,
    });
    const gallery = await this.galleryRepository.save(createGallery);

    if (!gallery) {
      throw new InternalServerErrorException({
        status: 500,
        message: '갤러리 생성이 되지 않았습니다.',
      });
    }

    return gallery;
  }
}
