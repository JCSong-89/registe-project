import {
  CreatorInterface,
  DeleterInterface,
  ReaderInterface,
  UpdaterInterface,
} from './operator.inferface';

export class AccountCreator {
  private creator: CreatorInterface;

  async create(data: any) {
    return this.creator.create(data);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class AccountReader {
  private reader: ReaderInterface;

  async read(identityData?: any, size?: number, page?: number) {
    return this.reader.read(identityData || null, size || 10, page || 1);
  }

  setOperator(operator: ReaderInterface): void {
    this.reader = operator;
  }
}

export class AccountUpdater {
  private updater: UpdaterInterface;

  async update(data: any, id: string | string[]) {
    return this.updater.update(data, id);
  }

  setOperator(operator: UpdaterInterface): void {
    this.updater = operator;
  }
}

export class AccountDeleter {
  private deleter: DeleterInterface;

  async delete(id: string | string[]) {
    return this.deleter.delete(id);
  }

  setOperator(operator: DeleterInterface): void {
    this.deleter = operator;
  }
}
