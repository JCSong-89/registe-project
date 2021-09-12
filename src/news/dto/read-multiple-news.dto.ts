import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationCore } from 'src/common/pagination_core';
import { News } from '../entity/news.entity';

export class ReadNewsServiceResponseDto {
  @ApiResponseProperty()
  newsId: string;
  @ApiResponseProperty()
  title: string;
  @ApiResponseProperty()
  reportDate: Date;
  @ApiResponseProperty()
  media: string;
  @ApiResponseProperty()
  content: string;
  @ApiResponseProperty()
  top: boolean;

  constructor(data: News) {
    this.newsId = data.id;
    this.title = data.title;
    this.reportDate = data.reportDate;
    this.media = data.media;
    this.content = data.content;
    this.top = data.top;
  }
}

export class ReadNewsPageServiceResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadNewsServiceResponseDto] })
  data: ReadNewsServiceResponseDto[];

  constructor(
    data: ReadNewsServiceResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}

export class ReadNewsAdminResponseDto extends ReadNewsServiceResponseDto {
  @ApiResponseProperty()
  createdAt: Date;

  constructor(data: News) {
    super(data);
    this.createdAt = data.createdAt;
  }
}

export class ReadNewsPageAdminResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadNewsAdminResponseDto] })
  data: ReadNewsAdminResponseDto[];

  constructor(
    data: ReadNewsAdminResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}
