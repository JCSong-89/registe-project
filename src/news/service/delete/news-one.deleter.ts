import { DeleterInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsOneDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async delete(id: string) {
    const targetNews = await this.newsRepository.findOne({ id });

    if (!targetNews) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 뉴스를 찾지 못했습니다.',
      });
    }

    await this.newsRepository.remove(targetNews);
    const checkDeleted = await this.newsRepository.findOne({ id });

    if (checkDeleted) {
      throw new InternalServerErrorException({
        status: 500,
        message: '삭제 시도한 뉴스가 삭제 되지 않았습니다..',
      });
    }

    return { status: 200, message: 'success' };
  }
}
