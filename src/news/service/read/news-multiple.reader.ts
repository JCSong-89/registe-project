import { ReaderInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NewsOrderByEnum,
  NewsSearchEnum,
} from 'src/news/enum/news-orderby.enum';

@Injectable()
export class NewsMultipleReader implements ReaderInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async read(
    query: NewsSearchEnum,
    orderBy: NewsOrderByEnum,
    size: number,
    page: number,
    search: string,
  ) {
    let by: 'DESC' | 'ASC' = 'ASC';

    if (orderBy === NewsOrderByEnum.CREATE || NewsOrderByEnum.REPORT)
      by = 'DESC';

    return await this.newsRepository
      .createQueryBuilder('news')
      .where(`news.${query} like :query`, { query: `%${search}%` })
      .orderBy('news.top', 'DESC')
      .addOrderBy(`news.${orderBy}`, by)
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }
}
