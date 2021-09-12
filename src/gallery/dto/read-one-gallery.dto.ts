import { Gallery } from '../entity/gallery.entity';
import { File } from '../../file/entity/file.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ReadOneGalleryServiceResponseDto {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  title: string;
  @ApiResponseProperty()
  content: string;
  @ApiResponseProperty()
  top: boolean;
  @ApiResponseProperty()
  startedAt: Date;
  @ApiResponseProperty()
  finishedAt: Date;
  @ApiResponseProperty({ type: [File] })
  files: File[];

  constructor(data: Gallery, files: File[]) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.top = data.top;
    this.startedAt = data.startedAt;
    this.finishedAt = data.finishedAt;
    this.files = files;
  }
}

export class ReadOneGalleryAdminResponseDto extends ReadOneGalleryServiceResponseDto {
  constructor(data: Gallery, files: File[]) {
    super(data, files);
  }
}
