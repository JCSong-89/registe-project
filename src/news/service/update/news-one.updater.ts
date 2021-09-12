import { UpdaterInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { Repository } from 'typeorm';
import { UpdateOneNewsRequestDto } from '../../dto/update-one-news.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsOneUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async update(bodyData: UpdateOneNewsRequestDto, id: string) {
    const targetNews = await this.newsRepository.findOne({ id });
    const count = await this.newsRepository.count({where: {top: true}})
      
    if(count >= 3 && bodyData.top) {
      throw new BadRequestException({ status: 400, message: '상위노출은 3개까지만 가능합니다.'})
    }

    if (!targetNews) {
      throw new NotFoundException({
        status: 404,
        message: '업데이트할 뉴스를 찾지 못했습니다.',
      });
    }

    await this.newsRepository.update(targetNews.id, {
      ...bodyData,
    });

    return { status: 200, message: 'success' };
  }
}
