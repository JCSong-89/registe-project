import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { MessageStatusCoreDto } from 'src/common/dto/message-status-core.dto';
import { CreateOneFileResponseDto } from './dto/create-one-file.dto';
import { UploadFileMetadataDto } from './dto/upload-file-meta-data.dto';
import { FileCreator, FileDeleter } from './operator/file.operator';
import { FileMultipleCreator } from './service/create/file-multiple.creator';
import { FileOneCreator } from './service/create/file-one.creator';
import { FileOneDeleter } from './service/delete/file-one.deleter';

@ApiTags('파일 등록/삭제')
@Controller('/v1/admin/files')
export class FileController {
  constructor(
    private readonly fileOneCreator: FileOneCreator,
    private readonly fileOneDeleter: FileOneDeleter,
    private readonly fileMultipleCreator: FileMultipleCreator,

    private readonly fileCreator: FileCreator,
    private readonly fileDeleter: FileDeleter,
  ) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateOneFileResponseDto })
  @Post()
  async createOne(@UploadedFile() file: UploadFileMetadataDto) {
    file.encoding = 'utf-8';
    this.fileCreator.setOperator(this.fileOneCreator);
    const request = await this.fileCreator.create(file);

    return new CreateOneFileResponseDto(request);
  }
  /*
  //@ApiBearerAuth('Authorization')
  //@Auth()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiMultiFile()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateOneFileResponseDto })
  @Post('multiple')
  async createMultiple(@UploadedFiles() files: UploadFileMetadataDto[]) {
    this.fileCreator.setOperator(this.fileMultipleCreator);
    const request = await this.fileCreator.create(files);

    return request;
  }
*/
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'fileId' })
  @Delete(':fileId')
  async deleteOne(@Param('fileId') fileId: string) {
    this.fileDeleter.setOperator(this.fileOneDeleter);
    const result = await this.fileDeleter.delete(fileId);

    return new MessageStatusCoreDto(result);
  }
}
