import { UploadFileMetadataDto } from '../dto/upload-file-meta-data.dto';
import { Category } from '../enum/category.enum';
import {
  CreatorInterface,
  DeleterInterface,
  ReaderInterface,
  UpdaterInterface,
} from './operator.inferface';

export class FileCreator {
  private creator: CreatorInterface;

  async create(file: UploadFileMetadataDto | UploadFileMetadataDto[]) {
    return this.creator.create(file);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class FileManyCreator {
  private creator: CreatorInterface;

  async create(
    file: UploadFileMetadataDto | UploadFileMetadataDto[],
    fkId: string,
  ) {
    return this.creator.create(file, fkId);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class FileDeleter {
  private deleter: DeleterInterface;

  async delete(id: string | string[]) {
    return this.deleter.delete(id);
  }

  setOperator(operator: DeleterInterface): void {
    this.deleter = operator;
  }
}

export class FileReader {
  private reader: ReaderInterface;

  async read(
    fkId: string, // 외래키를 넣는다
  ) {
    return this.reader.read(fkId);
  }

  setOperator(operator: ReaderInterface): void {
    this.reader = operator;
  }
}

export class FileUpdater {
  private updater: UpdaterInterface;

  async update(
    ids: string[],
    fkId: string, // 외래키를 넣는다
    category: Category,
  ) {
    return this.updater.update(ids, fkId, category);
  }

  setOperator(operator: UpdaterInterface): void {
    this.updater = operator;
  }
}
