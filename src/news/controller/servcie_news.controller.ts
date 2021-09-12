import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReadOneNewsServiceResponseDto } from '../dto/read-one-news.dto';
import {
  ReadNewsPageServiceResponseDto,
  ReadNewsServiceResponseDto,
} from '../dto/read-multiple-news.dto';
import { News } from '../entity/news.entity';
import { NewsOrderByEnum, NewsSearchEnum } from '../enum/news-orderby.enum';
import { NewsMultipleReader } from '../service/read/news-multiple.reader';
import { NewsOneReader } from '../service/read/news-one.reader';
import { NewsMainReader } from '../service/read/news-main.reader';
import { ReadMainNewsServiceResponseDto } from '../dto/read-main-news.dto';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewsReader } from '../operator/news.operator';
import { NewsNormalMultipleReader } from '../service/read/news-normal-multiple.reader';
import { NewsTopGetter } from '../service/read/news-top-getter.reader';

@ApiTags('뉴스 서비스')
@Controller('/v1/service/news')
export class ServiceNewsController {
  constructor(
    private readonly newsMainReader: NewsMainReader,
    private readonly newsOneReader: NewsOneReader,
    private readonly newsNormalMultipleReader: NewsNormalMultipleReader,
    private readonly newsTopGetter: NewsTopGetter,

    private readonly newsReader: NewsReader,
  ) {}

  @Get('/top-news')
  async getNewsTop(){
    this.newsReader.setOperator(this.newsTopGetter);
    const topNews = await this.newsReader.read();
    const count = topNews.length

    return {topNews, count}
  }

  @ApiOkResponse({ type: [ReadMainNewsServiceResponseDto] })
  @Get('main')
  async getMain() {
    const {topNews, count} = await this.getNewsTop()
    const normalNewsGetnum = 5 - count

    this.newsReader.setOperator(this.newsMainReader);
    const news = await this.newsReader.read(null, null, normalNewsGetnum);

    const totalNews = [...topNews, ...news]
    const data = totalNews.map((item: News) => {
      return new ReadMainNewsServiceResponseDto(item);
    });

    return data;
  }

  @ApiParam({ name: 'newsId' })
  @ApiOkResponse({ type: ReadOneNewsServiceResponseDto })
  @Get(':newsId')
  async getOne(@Param('newsId') newsId: string) {
    this.newsReader.setOperator(this.newsOneReader);
    const { targetNews, next, prev } = await this.newsReader.read(newsId);

    return new ReadOneNewsServiceResponseDto(targetNews, next, prev);
  }

  @ApiOkResponse({ type: ReadNewsPageServiceResponseDto })
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
    this.newsReader.setOperator(this.newsNormalMultipleReader);
    const [news, count] = await this.newsReader.read(
      category || NewsSearchEnum.TITLE,
      orderBy || NewsOrderByEnum.CREATE,
      size || 10,
      page || 1,
      search || '',
    );
    const data = news.map((item: News) => {
      return new ReadNewsServiceResponseDto(item);
    });

    return new ReadNewsPageServiceResponseDto(
      data,
      count,
      size || 10,
      page || 1,
    );
  }
}
