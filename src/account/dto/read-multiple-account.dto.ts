import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationCore } from 'src/common/pagination_core';
import { Account } from '../entity/account.entity';
import { ReadOneAccountResponseDto } from './read-one-account.dto';

export class ReadAccountAdminResponseDto extends ReadOneAccountResponseDto {
  constructor(data: Account) {
    super(data);
  }
}

export class ReadAccountPageAdminResponseDto extends PaginationCore {
  @ApiResponseProperty({ type: ReadAccountAdminResponseDto })
  data: ReadAccountAdminResponseDto[];

  constructor(
    data: ReadAccountAdminResponseDto[],
    count: number,
    size: number,
    page: number,
  ) {
    super(count, size, page);
    this.data = data;
  }
}
