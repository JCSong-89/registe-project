import { ApiResponseProperty } from '@nestjs/swagger';
import { News } from '../entity/news.entity';
import { ReadNewsServiceResponseDto } from './read-multiple-news.dto';

export class ReadMainNewsServiceResponseDto{
  @ApiResponseProperty()
  newsId: string;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  top: boolean;
  
  @ApiResponseProperty()
  createdAt: Date

  @ApiResponseProperty()
  media: string;

  @ApiResponseProperty()
  reportDate: Date

  constructor(data: News) {
    this.media = data.media;
    this.newsId = data.id;
    this.top = data.top;
    this.title = data.title;
    this.createdAt = data.createdAt;
    this.reportDate = data.reportDate
  }
}
