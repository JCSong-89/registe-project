import { CreatorInterface } from './operator.interface';
import { ReaderInterface } from './operator.interface';
import { UpdaterInterface } from './operator.interface';
import { DeleterInterface } from './operator.interface';

import { GalleryOrderByEnum } from '../enum/gallery-orderby.enum';

export class GalleryCreator {
  private creator: CreatorInterface;

  async create(data: any) {
    return this.creator.create(data);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class GalleryDeleter {
  private deleter: DeleterInterface;

  async delete(id: string | string[]) {
    return this.deleter.delete(id);
  }

  setOperator(operator: DeleterInterface): void {
    this.deleter = operator;
  }
}

export class GalleryReader {
  private reader: ReaderInterface;

  async read(
    identityData?: string,
    orderBy?: GalleryOrderByEnum,
    size?: number,
    page?: number,
  ) {
    return this.reader.read(
      identityData || '',
      orderBy || null,
      size || 10,
      page || 1,
    );
  }

  setOperator(operator: ReaderInterface): void {
    this.reader = operator;
  }
}

export class GalleryUpdater {
  private updater: UpdaterInterface;

  async update(data: any, id: string | string[]) {
    return this.updater.update(data, id);
  }

  setOperator(operator: UpdaterInterface): void {
    this.updater = operator;
  }
}
