import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatorInterface } from 'src/file/operator/operator.inferface';
import { UploadFileMetadataDto } from 'src/file/dto/upload-file-meta-data.dto';
import { ConfigOptions } from 'src/common/enum/config-option.enm';
import { FileModuleOptions } from 'src/file/file.inferface';
import { FileUploadOptions } from 'src/file/enum/file-upload-option.enum';
import { File } from '../../entity/file.entity';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} from '@azure/storage-blob';
import cryptoRandomString from 'crypto-random-string';
import { Readable as ReadableStream } from 'stream';

@Injectable()
export class FileOneCreator implements CreatorInterface {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(ConfigOptions.FILE) private readonly options: FileModuleOptions,
  ) {}

  async create(file: UploadFileMetadataDto) {
    const azureAccount = this.options.azureAccount;
    const azureSASKey = this.options.azureSASKey;
    const sharedKeyCredential = new StorageSharedKeyCredential(
      azureAccount,
      azureSASKey,
    );
    const pipeline = newPipeline(sharedKeyCredential);
    const blobServiceClient = new BlobServiceClient(
      `https://${azureAccount}.blob.core.windows.net`,
      pipeline,
    );
    const containerName = this.options.containerName;
    const blobName = cryptoRandomString({ length: 16 });
    const fileStream = ReadableStream.from(file.buffer);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(`${blobName}`);

    await blockBlobClient.uploadStream(
      fileStream,
      FileUploadOptions.BUFFER,
      FileUploadOptions.CONCURRENCY,
      {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      },
    );

    const url = `https://${azureAccount}.blob.core.windows.net/${containerName}/${blobName}`;
    const createFile = this.fileRepository.create({
      blobname: blobName,
      url,
      type: file.mimetype,
      filename: file.originalname,
    });
    const saveFile = this.fileRepository.save(createFile);

    return saveFile;
  }
}
