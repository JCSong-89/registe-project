import { UpdaterInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import { UpdateOneGalleryRequestDto } from '../../dto/update-one-gallery.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GalleryOneUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async update(bodyData: UpdateOneGalleryRequestDto, id: string) {
    const { title, content, startedAt, top, finishedAt } = bodyData;
    const targetGallery = await this.galleryRepository.findOne({ id });

    if (!targetGallery) {
      throw new NotFoundException({
        status: 404,
        message: '업데이트할 갤러리를 찾지 못했습니다.',
      });
    }

    await this.galleryRepository.update(targetGallery.id, {
      title,
      content,
      startedAt,
      top,
      finishedAt,
    });

    const checkUpdated = await this.galleryRepository.findOne({
      id,
    });

    return checkUpdated;
  }
}
