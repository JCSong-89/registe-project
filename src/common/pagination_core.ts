import { ApiResponseProperty } from '@nestjs/swagger';

export class PaginationCore {
  @ApiResponseProperty()
  count: number;
  @ApiResponseProperty()
  size: number;
  @ApiResponseProperty()
  page: number;
  @ApiResponseProperty()
  totalPage: number; // 총 페이지 수

  constructor(count: number, size: number, page: number) {
    this.count = count;
    this.size = size;
    this.page = page;
    this.totalPage = Math.ceil(count / size);
  }
}
