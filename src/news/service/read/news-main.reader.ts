import { ReaderInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsMainReader implements ReaderInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async read(_, __, num: number) {
    console.log(num)
    return await this.newsRepository.find({
      where: {top: false},
      order: { reportDate: 'DESC' },
      take: num,
    });
  }
}
