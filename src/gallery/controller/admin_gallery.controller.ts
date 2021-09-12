import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateOneGalleryRequestDto } from '../dto/create-one-gallery.dto';
import { UpdateOneGalleryRequestDto } from '../dto/update-one-gallery.dto';
import { GalleryOneCreator } from '../service/create/gallery-one.creator';
import {
  GalleryCreator,
  GalleryDeleter,
  GalleryReader,
  GalleryUpdater,
} from '../operator/gallery.operator';
import { GalleryOneUpdater } from '../service/update/gallery-one.updater';
import { GalleryOneDeleter } from '../service/delete/gallery-one.deleter';
import { GalleryMultipleDeleter } from '../service/delete/gallery-multiple.deleter';
import { GalleryOneReader } from '../service/read/gallery-one.reader';
import { GalleryMultipleReader } from '../service/read/gallery-multiple.reader';
import {
  ReadGalleryAdminResponseDto,
  ReadGalleryPageAdminResponseDto,
} from '../dto/read-multiple-gallery.dto';
import { Gallery } from '../entity/gallery.entity';
import { ReadOneGalleryAdminResponseDto } from '../dto/read-one-gallery.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { GalleryOrderByEnum } from '../enum/gallery-orderby.enum';
import { FileMultipleUpdater } from 'src/file/service/update/file-multiple.updater';
import {
  FileUpdater,
  FileReader,
  FileDeleter,
} from 'src/file/operator/file.operator';
import { Category } from 'src/file/enum/category.enum';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { FileMultipleDeleter } from 'src/file/service/delete/file-multiple.deleter';
import { FileManyMultipleDeleter } from 'src/file/service/delete/file-many-mutiple.deleter';
import { MessageStatusCoreDto } from 'src/common/dto/message-status-core.dto';
import { GalleryNormalMultipleReader } from '../service/read/gallery-normal-multiple.reader';

@ApiTags('갤러리 어드민')
@Controller('/v1/admin/galleries')
export class AdminGalleryController {
  constructor(
    private readonly galleryOneCreator: GalleryOneCreator,
    private readonly galleryOneReader: GalleryOneReader,
    private readonly galleryOneUpdater: GalleryOneUpdater,
    private readonly galleryOneDeleter: GalleryOneDeleter,
    private readonly galleryNormalMultipleReader: GalleryNormalMultipleReader,
    private readonly galleryMultipleDeleter: GalleryMultipleDeleter,

    private readonly galleryCreator: GalleryCreator,
    private readonly galleryReader: GalleryReader,
    private readonly galleryUpdater: GalleryUpdater,
    private readonly galleryDeleter: GalleryDeleter,

    private readonly fileMultipleReader: FileMultipleReader,
    private readonly fileMultipleUpdater: FileMultipleUpdater,
    private readonly fileMultipleDeleter: FileMultipleDeleter,
    private readonly fileManyMultipleDeleter: FileManyMultipleDeleter,

    private readonly fileReader: FileReader,
    private readonly fileUpdater: FileUpdater,
    private readonly fileDeleter: FileDeleter,
  ) {}

  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({ type: MessageStatusCoreDto })
  @Auth()
  @Post()
  async createOne(@Body() bodyData: CreateOneGalleryRequestDto) {
    if (bodyData.fileIds.length > 10) {
      return { status: 400, message: '등록 이미지가 10개가 넘습니다.' };
    }

    this.galleryCreator.setOperator(this.galleryOneCreator);
    const gallery = await this.galleryCreator.create(bodyData);

    this.fileUpdater.setOperator(this.fileMultipleUpdater);
    const reuslt = await this.fileUpdater.update(
      bodyData.fileIds,
      gallery.id,
      Category.GALLERY,
    );

    return new MessageStatusCoreDto(reuslt);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadOneGalleryAdminResponseDto })
  @Auth()
  @ApiParam({ name: 'galleryId' })
  @Get(':galleryId')
  async getOne(@Param('galleryId') galleryId: string) {
    this.galleryReader.setOperator(this.galleryOneReader);
    const gallery = await this.galleryReader.read(galleryId);

    this.fileReader.setOperator(this.fileMultipleReader);
    const files = await this.fileReader.read(gallery.id);

    return new ReadOneGalleryAdminResponseDto(gallery, files);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadGalleryPageAdminResponseDto })
  @Auth()
  @Get()
  @ApiQuery({ name: 'galleryName', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({
    name: 'orderBy',
    type: 'enum',
    enum: GalleryOrderByEnum,
    required: false,
  })
  async getMany(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('galleryName') galleryName: string,
    @Query('orderBy') orderBy: GalleryOrderByEnum,
  ) {
    this.galleryReader.setOperator(this.galleryNormalMultipleReader);
    const { pagination, count } = await this.galleryReader.read(
      galleryName || '',
      orderBy || GalleryOrderByEnum.CREATE,
      size || 10,
      page || 1,
    );

    const data = pagination.map((item: Gallery) => {
      return new ReadGalleryAdminResponseDto(item);
    });

    return new ReadGalleryPageAdminResponseDto(
      data,
      count,
      size || 10,
      page || 1,
    );
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'galleryId' })
  @Put(':galleryId')
  async updateOne(
    @Body() bodyData: UpdateOneGalleryRequestDto,
    @Param('galleryId') galleryId: string,
  ) {
    if (bodyData.fileIds.length > 10) {
      return { status: 400, message: '등록 이미지가 10개가 넘습니다.' };
    }

    this.galleryUpdater.setOperator(this.galleryOneUpdater);
    const gallery = await this.galleryUpdater.update(bodyData, galleryId);

    this.fileUpdater.setOperator(this.fileMultipleUpdater);
    const result = await this.fileUpdater.update(
      bodyData.fileIds,
      gallery.id,
      Category.GALLERY,
    );

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'galleryId' })
  @Delete(':galleryId')
  async deleteOne(@Param('galleryId') galleryId: string) {
    this.galleryDeleter.setOperator(this.galleryOneDeleter);
    await this.galleryDeleter.delete(galleryId);

    this.fileDeleter.setOperator(this.fileMultipleDeleter);
    const result = await this.fileDeleter.delete(galleryId);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @ApiQuery({ name: 'galleryIds', required: true })
  @Auth()
  @Delete()
  async deleteMultiple(@Query('galleryIds') galleryIds: string[]) {
    this.galleryDeleter.setOperator(this.galleryMultipleDeleter);
    await this.galleryDeleter.delete(galleryIds);

    this.fileDeleter.setOperator(this.fileManyMultipleDeleter);
    const result = await this.fileDeleter.delete(galleryIds);

    return new MessageStatusCoreDto(result);
  }
}
