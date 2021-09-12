import { ApiResponseProperty } from '@nestjs/swagger';
import { News } from '../entity/news.entity';

export class ReadOneNewsCore {
  @ApiResponseProperty()
  title: string;
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  reportDate: Date;
  @ApiResponseProperty()
  media: string;
  @ApiResponseProperty()
  content: string;

  constructor(data: News) {
    this.title = data.title;
    this.url = data.url;
    this.reportDate = data.reportDate;
    this.media = data.media;
    this.content = data.content;
  }
}

export class ReadOneNewsServiceResponseDto extends ReadOneNewsCore {
  @ApiResponseProperty()
  next: string;
  @ApiResponseProperty()
  prev: string;

  constructor(data: News, next: string | null, prev: string | null) {
    super(data);
    this.next = next;
    this.prev = prev;
  }
}

export class ReadOneNewsAdminResponseDto extends ReadOneNewsCore {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  top: boolean;
  @ApiResponseProperty()
  url: string;

  constructor(data: News) {
    super(data);
    this.id = data.id;
    this.top = data.top;
    this.url = data.url;
  }
}
