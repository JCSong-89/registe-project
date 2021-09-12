import { CreatorInterface } from './operator.interface';
import { ReaderInterface } from './operator.interface';
import { UpdaterInterface } from './operator.interface';
import { DeleterInterface } from './operator.interface';

import { NewsOrderByEnum } from '../enum/news-orderby.enum';

export class NewsCreator {
  private creator: CreatorInterface;

  async create(data: any) {
    return this.creator.create(data);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class NewsDeleter {
  private deleter: DeleterInterface;

  async delete(id: string | string[]) {
    return this.deleter.delete(id);
  }

  setOperator(operator: DeleterInterface): void {
    this.deleter = operator;
  }
}

export class NewsReader {
  private reader: ReaderInterface;

  async read(
    identityData?: string,
    orderBy?: NewsOrderByEnum,
    size?: number,
    page?: number,
    search?: string,
  ) {
    return this.reader.read(
      identityData || null,
      orderBy || null,
      size || 10,
      page || 1,
      search || '',
    );
  }

  setOperator(operator: ReaderInterface): void {
    this.reader = operator;
  }
}

export class NewsUpdater {
  private updater: UpdaterInterface;

  async update(data: any, id: string | string[]) {
    return this.updater.update(data, id);
  }

  setOperator(operator: UpdaterInterface): void {
    this.updater = operator;
  }
}
