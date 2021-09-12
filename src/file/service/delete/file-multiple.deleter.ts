import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
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
export class FileMultipleDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(ConfigOptions.FILE)
    private readonly options: FileModuleOptions,
  ) {}

  async delete(fkId: string) {
    const targetFiles = await this.fileRepository.find({ fkId });
    const ids = targetFiles.map(file => file.id);
    await this.fileRepository.delete(ids);

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

    for (const i of targetFiles) {
      const blockBlobClient = containerClient.getBlockBlobClient(
        `${i.blobname}`,
      );
      await blockBlobClient.deleteIfExists();
    }

    return { status: 200, message: 'success' };
  }
}
