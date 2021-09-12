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
import { CreateOneNewsRequestDto } from '../dto/create-one-news.dto';
import { UpdateOneNewsRequestDto } from '../dto/update-one-news.dto';
import { NewsOneCreator } from '../service/create/news-one.creator';
import {
  NewsCreator,
  NewsDeleter,
  NewsReader,
  NewsUpdater,
} from '../operator/news.operator';
import { NewsOneUpdater } from '../service/update/news-one.updater';
import { NewsOneDeleter } from '../service/delete/news-one.deleter';
import { NewsMultipleDeleter } from '../service/delete/news-multiple.deleter';
import { NewsOneReader } from '../service/read/news-one.reader';
import { NewsMultipleReader } from '../service/read/news-multiple.reader';
import { NewsOrderByEnum, NewsSearchEnum } from '../enum/news-orderby.enum';
import {
  ReadNewsAdminResponseDto,
  ReadNewsPageAdminResponseDto,
} from '../dto/read-multiple-news.dto';
import { News } from '../entity/news.entity';
import { ReadOneNewsAdminResponseDto } from '../dto/read-one-news.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { MessageStatusCoreDto } from 'src/common/dto/message-status-core.dto';
import { NewsNormalMultipleReader } from '../service/read/news-normal-multiple.reader';

@ApiTags('뉴스 어드민')
@Controller('/v1/admin/news')
export class AdminNewsController {
  constructor(
    private readonly newsOneCreator: NewsOneCreator,
    private readonly newsOneReader: NewsOneReader,
    private readonly newsOneUpdater: NewsOneUpdater,
    private readonly newsOneDeleter: NewsOneDeleter,
    private readonly newsMultipleReader: NewsMultipleReader,
    private readonly newsMultipleDeleter: NewsMultipleDeleter,

    private readonly newsCreator: NewsCreator,
    private readonly newsReader: NewsReader,
    private readonly newsUpdater: NewsUpdater,
    private readonly newsDeleter: NewsDeleter,
  ) {}

  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({ type: MessageStatusCoreDto })
  @Auth()
  @Post()
  async createOne(@Body() bodyData: CreateOneNewsRequestDto) {
    this.newsCreator.setOperator(this.newsOneCreator);
    const result = await this.newsCreator.create(bodyData);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadOneNewsAdminResponseDto })
  @Auth()
  @ApiParam({ name: 'newsId' })
  @Get(':newsId')
  async getOne(@Param('newsId') newsId: string) {
    this.newsReader.setOperator(this.newsOneReader);
    const { targetNews } = await this.newsReader.read(newsId);

    return new ReadOneNewsAdminResponseDto(targetNews);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadNewsPageAdminResponseDto })
  @Auth()
  @Get()
  @ApiQuery({
    name: 'category',
    type: 'enum',
    enum: NewsSearchEnum,
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    type: 'enum',
    enum: NewsOrderByEnum,
    required: false,
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getMany(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('category') category: NewsSearchEnum,
    @Query('search') search: string,
    @Query('orderBy') orderBy: NewsOrderByEnum,
  ) {
    this.newsReader.setOperator(this.newsMultipleReader);
    const [news, count] = await this.newsReader.read(
      category || NewsSearchEnum.TITLE,
      orderBy || NewsOrderByEnum.CREATE,
      size || 10,
      page || 1,
      search || '',
    );

    const data = news.map((item: News) => {
      return new ReadNewsAdminResponseDto(item);
    });

    return new ReadNewsPageAdminResponseDto(data, count, size || 10, page || 1);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'newsId' })
  @Put(':newsId')
  async updateOne(
    @Body() bodyData: UpdateOneNewsRequestDto,
    @Param('newsId') newsId: string,
  ) {
    this.newsUpdater.setOperator(this.newsOneUpdater);
    const reuslt = await this.newsUpdater.update(bodyData, newsId);

    return new MessageStatusCoreDto(reuslt);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'newsId' })
  @Delete(':newsId')
  async deleteOne(@Param('newsId') newsId: string) {
    this.newsDeleter.setOperator(this.newsOneDeleter);
    const result = await this.newsDeleter.delete(newsId);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @ApiQuery({ name: 'newsIds', required: true })
  @Auth()
  @Delete()
  async deleteMultiple(@Query('newsIds') newsIds: string[]) {
    this.newsDeleter.setOperator(this.newsMultipleDeleter);
    const result = await this.newsDeleter.delete(newsIds);

    return new MessageStatusCoreDto(result);
  }
}
