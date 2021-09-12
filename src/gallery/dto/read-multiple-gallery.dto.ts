import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationCore } from 'src/common/pagination_core';
import { Gallery } from '../entity/gallery.entity';

export class ReadGalleryServiceResponseDto {
  @ApiResponseProperty()
  galleryId: string;
  @ApiResponseProperty()
  title: string;
  @ApiResponseProperty()
  startedAt: Date;
  @ApiResponseProperty()
  finishedAt: Date;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  files: string[];

  constructor(data: any) {
    this.galleryId = data.id;
    this.title = data.title;
    this.startedAt = data.startedAt;
    this.finishedAt = data.finishedAt;
    this.createdAt = data.createdAt;
    this.files = data.files.map(item => item.url);
  }
}

export class ReadGalleryPageServiceResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadGalleryServiceResponseDto] })
  data: ReadGalleryServiceResponseDto[];

  constructor(
    data: ReadGalleryServiceResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}

export class ReadGalleryAdminResponseDto extends ReadGalleryServiceResponseDto {
  constructor(data: Gallery) {
    super(data);
  }
}

export class ReadGalleryPageAdminResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadGalleryAdminResponseDto] })
  data: ReadGalleryAdminResponseDto[];

  constructor(
    data: ReadGalleryAdminResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}
