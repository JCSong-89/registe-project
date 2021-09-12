import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReadOneGalleryServiceResponseDto } from '../dto/read-one-gallery.dto';
import {
  ReadGalleryPageServiceResponseDto,
  ReadGalleryServiceResponseDto,
} from '../dto/read-multiple-gallery.dto';
import { Gallery } from '../entity/gallery.entity';
import { GalleryOrderByEnum } from '../enum/gallery-orderby.enum';
import { GalleryOneReader } from '../service/read/gallery-one.reader';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GalleryReader } from '../operator/gallery.operator';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { FileReader } from 'src/file/operator/file.operator';
import { GalleryStartReader } from '../service/read/gallery-start.reader';

@ApiTags('갤러리 서비스')
@Controller('/v1/service/galleries')
export class ServiceGalleryController {
  constructor(
    private readonly galleryOneReader: GalleryOneReader,
    private readonly galleryStartReader: GalleryStartReader,
    private readonly galleryReader: GalleryReader,

    private readonly fileMultipleReader: FileMultipleReader,
    private readonly fileReader: FileReader,
  ) {}

  @ApiOkResponse({ type: ReadOneGalleryServiceResponseDto })
  @ApiParam({ name: 'galleryId' })
  @Get(':galleryId')
  async getOne(@Param('galleryId') galleryId: string) {
    this.galleryReader.setOperator(this.galleryOneReader);
    const gallery = await this.galleryReader.read(galleryId);

    this.fileReader.setOperator(this.fileMultipleReader);
    const files = await this.fileReader.read(gallery.id);

    return new ReadOneGalleryServiceResponseDto(gallery, files);
  }

  @ApiOkResponse({ type: [ReadGalleryServiceResponseDto] })
  @Get()
  @ApiQuery({ name: 'galleryName', required: false })
  async getMany(@Query('galleryName') galleryName: string) {
    this.galleryReader.setOperator(this.galleryStartReader);
    const gallery = await this.galleryReader.read(
      galleryName || '',
      GalleryOrderByEnum.START,
    );
    const data = gallery.map((item: Gallery) => {
      return new ReadGalleryServiceResponseDto(item);
    });

    return data;
  }
}
