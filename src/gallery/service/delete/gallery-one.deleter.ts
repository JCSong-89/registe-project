import { DeleterInterface } from '../../operator/operator.interface';
import { Gallery } from '../../entity/gallery.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GalleryOneDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async delete(id: string) {
    const targetGallery = await this.galleryRepository.findOne({ id });

    if (!targetGallery) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 뉴스를 찾지 못했습니다.',
      });
    }

    await this.galleryRepository.remove(targetGallery);
    const checkDeleted = await this.galleryRepository.findOne({ id });

    if (checkDeleted) {
      throw new InternalServerErrorException({
        status: 500,
        message: '삭제 시도한 갤러리가 삭제 되지 않았습니다..',
      });
    }

    return { status: 200, message: 'success' };
  }
}
