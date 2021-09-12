import { ReaderInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsTopGetter implements ReaderInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async read() {
    return await this.newsRepository
      .createQueryBuilder('news')
      .where('news.top = :top', {top: true})
      .orderBy(`news.updatedAt`, 'DESC')
      .take(3)
      .getMany()
  }
}
