import { ApiResponseProperty } from '@nestjs/swagger';
import { File } from '../entity/file.entity';

export class CreateOneFileResponseDto {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  filename: string;
  @ApiResponseProperty()
  type: string;

  constructor(data: File) {
    this.id = data.id;
    this.url = data.url;
    this.filename = data.filename;
    this.type = data.type;
  }
}
