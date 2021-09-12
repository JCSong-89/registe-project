export interface CreatorInterface {
  create(data: any, fkId?: string): any;
}

export interface ReaderInterface {
  read(id: any): any;
}

export interface UpdaterInterface {
  update(ids: any, fkId: any, category: any): any;
}

export interface DeleterInterface {
  delete(id: any, fkId?: any): any;
}
