import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountReader } from 'src/account/operator/acccount.operator';
import { AccountCertAdminReader } from 'src/account/service/read/account-cert-admin.reader';
import { MessageStatusCoreDto } from 'src/common/dto/message-status-core.dto';
import { UploadFileMetadataDto } from 'src/file/dto/upload-file-meta-data.dto';
import { FileManyCreator } from 'src/file/operator/file.operator';
import { FileMultipleCreator } from 'src/file/service/create/file-multiple.creator';
import { ApiMultiFile } from 'src/utill/api-files.decorator';
import { emailSend } from 'src/utill/email-sender.utill';
import { CreateOneRegisteProjectRequestDto } from '../dto/create-one-registe-project.dto';
import { RegisteProjectCreator } from '../operator/registe-project.operator';
import { RegisteProjectOneCreator } from '../service/create/registe-project-one.creator';

@ApiTags('프로젝트등록 서비스')
@Controller('/v1/service/registe-projects')
export class ServiceRegisteProjectController {
  constructor(
    private readonly registeProjectCreator: RegisteProjectCreator,
    private readonly registeProjectOneCreator: RegisteProjectOneCreator,
    private readonly fileManyCreator: FileManyCreator,
    private readonly fileMultipleCreator: FileMultipleCreator,
    private readonly accountReader: AccountReader,
    private readonly accountCertAdminReader: AccountCertAdminReader
  ) {}

  @UseInterceptors(FilesInterceptor('files'))
  @ApiMultiFile()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Post()
  async create(
    @Body() bodyData: CreateOneRegisteProjectRequestDto,
    @UploadedFiles() files: UploadFileMetadataDto[],
  ) {
    this.registeProjectCreator.setOperator(this.registeProjectOneCreator);
    const registeProject = await this.registeProjectCreator.create(bodyData);

    this.accountReader.setOperator(this.accountCertAdminReader);
    const admins = await this.accountReader.read()

    this.fileManyCreator.setOperator(this.fileMultipleCreator);
    await this.fileManyCreator.create(files, registeProject.id);

    const result = await emailSend(bodyData, files, admins);

    return new MessageStatusCoreDto(result);
  }
}
