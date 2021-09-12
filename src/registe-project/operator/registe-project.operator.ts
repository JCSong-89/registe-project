import { RegisteProjectOrderByEnum } from '../enum/registe-project-orderby.enum';
import {
  CreatorInterface,
  DeleterInterface,
  ReaderInterface,
} from './operator.interface';

export class RegisteProjectCreator {
  private creator: CreatorInterface;

  async create(data: any) {
    return this.creator.create(data);
  }

  setOperator(operator: CreatorInterface): void {
    this.creator = operator;
  }
}

export class RegisteProjectReader {
  private reader: ReaderInterface;

  async read(
    identityData?: string,
    orderBy?: RegisteProjectOrderByEnum,
    size?: number,
    page?: number,
    search?: string
  ) {
    return this.reader.read(
      identityData || '',
      orderBy || null,
      size || 10,
      page || 1,
      search || ''
    );
  }

  setOperator(operator: ReaderInterface): void {
    this.reader = operator;
  }
}

export class RegisteProjectDeleter {
  private deleter: DeleterInterface;

  async delete(id: string | string[]) {
    return this.deleter.delete(id);
  }

  setOperator(operator: DeleterInterface): void {
    this.deleter = operator;
  }
}
