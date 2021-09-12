import { ApiResponseProperty } from '@nestjs/swagger';

export class MessageStatusCoreDto {
  @ApiResponseProperty()
  status: number;
  @ApiResponseProperty()
  message: string;

  constructor(data: any) {
    this.status = data.status;
    this.message = data.message;
  }
}
