import { RegisteProjectOrderByEnum } from '../enum/registe-project-orderby.enum';

export interface CreatorInterface {
  create(data: any): any;
}

export interface ReaderInterface {
  read(
    /*ID값 또는 검색을 위한 쿼리스트링 속성*/
    identityData: string,
    orderBy?: RegisteProjectOrderByEnum,
    size?: number,
    page?: number,
    search?: string,
  ): any;
}

/*export interface UpdaterInterface {
  update(data: any, id: string | string[]): any;
}*/

export interface DeleterInterface {
  delete(id: string | string[]): any;
}
