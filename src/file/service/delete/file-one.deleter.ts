import { Repository } from 'typeorm';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../entity/file.entity';
import { DeleterInterface } from 'src/file/operator/operator.inferface';
import { ConfigOptions } from 'src/common/enum/config-option.enm';
import { FileModuleOptions } from 'src/file/file.inferface';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

@Injectable()
export class FileOneDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(ConfigOptions.FILE) private readonly options: FileModuleOptions,
  ) {}

  async delete(id: string) {
    const targetFile = await this.fileRepository.findOne({ id });

    if (!targetFile) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 자료를 찾지 못했습니다.',
      });
    }

    await this.fileRepository.remove(targetFile);
    const checkDeleted = await this.fileRepository.findOne({ id });

    if (checkDeleted) {
      throw new InternalServerErrorException({
        status: 500,
        message: '삭제 시도한 자료가 삭제 되지 않았습니다..',
      });
    }

    const account = this.options.azureAccount;
    const accountKey = this.options.azureSASKey;
    const sharedKeyCredential = new StorageSharedKeyCredential(
      account,
      accountKey,
    );
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      sharedKeyCredential,
    );
    const containerName = this.options.containerName;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${targetFile.blobname}`,
    );

    await blockBlobClient.deleteIfExists();

    return { status: 200, message: 'success' };
  }
}
