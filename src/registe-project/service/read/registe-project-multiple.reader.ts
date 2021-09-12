import { ReaderInterface } from '../../operator/operator.interface';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../../../file/entity/file.entity';
import { RegisteProject } from 'src/registe-project/entity/registe-project.entity';
import { RegisteProjectOrderByEnum } from 'src/registe-project/enum/registe-project-orderby.enum';
@Injectable()
export class RegisteProjectMultipleReader implements ReaderInterface {
  constructor(
    @InjectRepository(RegisteProject)
    private registeProjectRepository: Repository<RegisteProject>,
  ) {}

  async read(
    query: string,
    orderBy: RegisteProjectOrderByEnum,
    size: number,
    page: number,
    search: string
  ) {
    console.log(query)
    console.log(search)
    let by: 'DESC' | 'ASC' = 'DESC';

    if (orderBy === RegisteProjectOrderByEnum.COMPANY_NAME) by = 'ASC';

    return await this.registeProjectRepository
      .createQueryBuilder('registeProjects')
      .leftJoinAndMapMany(
        'registeProjects.files',
        File,
        'files',
        'files.fkId = registeProjects.id',
      )
      .where(`registeProjects.${query} like :query`, { query: `%${search}%` })
      .orderBy(`registeProjects.${orderBy}`, by)
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }
}
