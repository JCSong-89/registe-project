import { AnnouncementOrderByEnum } from '../enum/announcement-orderby.enum';

import {
  CreatorInterface,
  ReaderInterface,
  UpdaterInterface,
  DeleterInterface,
} from './operator.interface';

export class AnnouncementCreator {
  private creator: CreatorInterface;

  async create(data: any, req: any) {
    return this.creator.create(data, req);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class AnnouncementReader {
  private reader: ReaderInterface;

  async read(
    identityData?: string,
    orderBy?: AnnouncementOrderByEnum,
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

export class AnnouncementUpdater {
  private updater: UpdaterInterface;

  async update(data: any, id: string | string[]) {
    return this.updater.update(data, id);
  }

  setOperator(operator: UpdaterInterface): void {
    this.updater = operator;
  }
}

export class AnnouncementDeleter {
  private deleter: DeleterInterface;

  async delete(id: string | string[]) {
    return this.deleter.delete(id);
  }

  setOperator(operator: DeleterInterface): void {
    this.deleter = operator;
  }
}
