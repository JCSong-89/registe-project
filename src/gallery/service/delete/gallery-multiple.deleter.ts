import { DeleterInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { In, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GalleryMultipleDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async delete(ids: string[]) {
    let idsArray = [];
    if (typeof ids !== 'object') {
      idsArray.push(ids);
    } else {
      idsArray = ids;
    }

    const targetGallery = await this.galleryRepository.find({
      where: {
        id: In(idsArray),
      },
    });

    if (targetGallery.length === 0) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 갤러리를 찾지 못했습니다.',
      });
    }

    await this.galleryRepository.remove(targetGallery);

    return { status: 200, message: 'success' };
  }
}
