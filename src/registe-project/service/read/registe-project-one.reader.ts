import { ReaderInterface } from '../../operator/operator.interface';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisteProject } from 'src/registe-project/entity/registe-project.entity';

@Injectable()
export class RegisteProjectOneReader implements ReaderInterface {
  constructor(
    @InjectRepository(RegisteProject)
    private registeProjectRepository: Repository<RegisteProject>,
  ) {}

  async read(id: string) {
    const target = await this.registeProjectRepository.findOne({ id });

    if (!target) {
      throw new NotFoundException({
        status: 404,
        message: '조회 데이터를 찾지 못했습니다.',
      });
    }

    return target;
  }
}
