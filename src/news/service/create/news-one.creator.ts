import { CreatorInterface } from '../../operator/operator.interface';
import { News } from '../../entity/news.entity';
import { Repository } from 'typeorm';
import { CreateOneNewsRequestDto } from 'src/news/dto/create-one-news.dto';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsOneCreator implements CreatorInterface {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(bodyData: CreateOneNewsRequestDto) {
    const { title, url, media, top, reportDate, content } = bodyData;
    const count = await this.newsRepository.count({where: {top: true}})
      
    if(count >= 3 && top) {
      throw new BadRequestException({ status: 400, message: '상위노출은 3개까지만 가능합니다.'})
    }

    const createNews = this.newsRepository.create({
      title,
      url,
      media,
      top,
      reportDate,
      content,
    });
    const news = await this.newsRepository.save(createNews);

    if (!news) {
      throw new InternalServerErrorException({
        status: 500,
        message: '뉴스 생성이 되지 않았습니다.',
      });
    }

    return { status: 200, message: 'success' };
  }
}
