import { DeleterInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { In, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsMultipleDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async delete(ids: string[]) {
    let idsArray = [];
    if (typeof ids !== 'object') {
      idsArray.push(ids);
    } else {
      idsArray = ids;
    }

    const targetNews = await this.newsRepository.find({
      where: {
        id: In(idsArray),
      },
    });

    if (targetNews.length === 0) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 뉴스를 찾지 못했습니다.',
      });
    }

    await this.newsRepository.remove(targetNews);
    const checkDeleted = await this.newsRepository.find({
      where: {
        id: In(idsArray),
      },
    });

    if (checkDeleted.length !== 0) {
      throw new InternalServerErrorException({
        status: 500,
        message: '삭제 시도한 뉴스가 삭제 되지 않았습니다..',
      });
    }

    return { status: 200, message: 'success' };
  }
}
