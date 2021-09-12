import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../entity/file.entity';
import { ReaderInterface } from 'src/file/operator/operator.inferface';

@Injectable()
export class FileMultipleReader implements ReaderInterface {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async read(fkId: string) {
    const targetFiles = await this.fileRepository.find({
      where: { fkId },
      select: ['id', 'url', 'type', 'filename'],
      order: { createdAt: 'ASC' },
    });

    return targetFiles;
  }
}
