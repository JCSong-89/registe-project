import { ReaderInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsOneReader implements ReaderInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async read(id: string) {
    const targetNews = await this.newsRepository.findOne({ id });

    if (!targetNews) {
      throw new NotFoundException({
        status: 404,
        message: '조회 데이터를 찾지 못했습니다.',
      });
    }
    
    const nextNews = await this.newsRepository.find({
      where: { idx: MoreThan(targetNews.idx) },
      select: ['id'],
      order: { idx: 'ASC' },
      take: 1,
    });
    const prevNews = await this.newsRepository.find({
      where: { idx: LessThan(targetNews.idx) },
      select: ['id'],
      order: { idx: 'DESC' },
      take: 1,
    });


    const next = nextNews.length != 0 ? nextNews[0].id : null;
    const prev = prevNews.length != 0 ? prevNews[0].id : null;

    return { targetNews, next, prev };
  }
}
