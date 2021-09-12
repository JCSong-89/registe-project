import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationCore } from 'src/common/pagination_core';
import { ReadOneRegisteProjectAdminResponseDto } from './read-one-registe-project.dto';

export class ReadRegisteProjectAdminResponseDto extends ReadOneRegisteProjectAdminResponseDto {
  constructor(data: any) {
    super(data, data.files);
  }
}

export class ReadRegisteProjectPageAdminResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: [ReadRegisteProjectAdminResponseDto] })
  data: ReadRegisteProjectAdminResponseDto[];

  constructor(
    data: ReadRegisteProjectAdminResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}
