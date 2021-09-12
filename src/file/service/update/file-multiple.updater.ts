import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/file/enum/category.enum';
import { UpdaterInterface } from 'src/file/operator/operator.inferface';
import { Repository } from 'typeorm';
import { File } from '../../entity/file.entity';

@Injectable()
export class FileMultipleUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async update(ids: string[], fkId: string, category: Category) {
    if (ids.length == 0) {
      return { status: 200, message: 'success' };
    }

    const oldFile = await this.fileRepository.find({
      fkId,
    });

    if (oldFile.length != 0) {
      const oldFileIds = oldFile.map(file => file.id);
      await this.fileRepository.update(oldFileIds, {
        fkId: null,
        category: null,
      });
    }

    await this.fileRepository.update(ids, {
      fkId,
      category,
    });

    return { status: 200, message: 'success' };
  }
}
