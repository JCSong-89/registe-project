import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileMultipleReader } from 'src/file/service/read/file-multiple.reader';
import { RegisteProjectReader } from '../operator/registe-project.operator';
import { RegisteProjectMultipleReader } from '../service/read/registe-project-multiple.reader';
import { RegisteProjectOneReader } from '../service/read/registe-project-one.reader';
import { FileReader } from 'src/file/operator/file.operator';
import { RegisteProjectOrderByEnum, RegisteProjectSearchEnum } from '../enum/registe-project-orderby.enum';
import { RegisteProject } from '../entity/registe-project.entity';
import { ReadOneRegisteProjectAdminResponseDto } from '../dto/read-one-registe-project.dto';
import {
  ReadRegisteProjectAdminResponseDto,
  ReadRegisteProjectPageAdminResponseDto,
} from '../dto/read-multiuple-registe-project.dto';
import { Auth } from 'src/auth/auth.decorator';
import { writeFile } from 'src/utill/excel.utill';
import { Response } from 'express';
import { RegisteProjectAllReader } from '../service/read/registe-project-all-reader';

@ApiBearerAuth('Authorization')
@Auth()
@ApiTags('프로젝트등록 어드민')
@Controller('/v1/admin/registe-projects')
export class AdminRegisteProjectController {
  constructor(
    private readonly registeProjectOneReader: RegisteProjectOneReader,
    private readonly registeProjectMultipleReader: RegisteProjectMultipleReader,
    private readonly registeProjectReader: RegisteProjectReader,
    private readonly registeProjectAllReader: RegisteProjectAllReader,

    private readonly fileMultipleReader: FileMultipleReader,
    private readonly fileReader: FileReader,
  ) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Get(':registeProjectId')
  @ApiOkResponse({ type: ReadOneRegisteProjectAdminResponseDto })
  @ApiParam({ name: 'registeProjectId' })
  async getOne(@Param('registeProjectId') registeProjectId: string) {
    this.registeProjectReader.setOperator(this.registeProjectOneReader);
    const targetRegisteProject = await this.registeProjectReader.read(registeProjectId);

    this.fileReader.setOperator(this.fileMultipleReader);
    const files = await this.fileReader.read(targetRegisteProject.id);

    return new ReadOneRegisteProjectAdminResponseDto(targetRegisteProject, files);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Get()
  @ApiOkResponse({ type: ReadRegisteProjectPageAdminResponseDto })
  @ApiQuery({
    name: 'category',
    type: 'enum',
    enum: RegisteProjectSearchEnum,
    required: false,
  })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({
    name: 'orderBy',
    type: 'enum',
    enum: RegisteProjectOrderByEnum,
    required: false,
  })
  @ApiQuery({ name: 'search', required: false })
  async getMany(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('category') category: RegisteProjectSearchEnum,
    @Query('search') search: string,
    @Query('orderBy') orderBy: RegisteProjectOrderByEnum,
  ) {
    this.registeProjectReader.setOperator(this.registeProjectMultipleReader);
    const [registeProjects, count] = await this.registeProjectReader.read(
      category || RegisteProjectSearchEnum.EMAIL,
      orderBy || RegisteProjectOrderByEnum.CREATE,
      size || 10,
      page || 1,
      search || '',
    );

    const data = registeProjects.map((item: RegisteProject) => {
      return new ReadRegisteProjectAdminResponseDto(item);
    });

    return new ReadRegisteProjectPageAdminResponseDto(
      data,
      count,
      size || 10,
      page || 1,
    );
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Get('/excel/download')
  async writeExcell(@Res() res: Response) {
    this.registeProjectReader.setOperator(this.registeProjectAllReader);
    const targetRegisteProjects = await this.registeProjectReader.read();
    const excell = writeFile(targetRegisteProjects, 'registeProjectLog');

    return res.download(excell);
  }
}
