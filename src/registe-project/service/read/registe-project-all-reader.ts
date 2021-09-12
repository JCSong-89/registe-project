import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisteProject } from 'src/registe-project/entity/registe-project.entity';
import { ReaderInterface } from 'src/registe-project/operator/operator.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RegisteProjectAllReader implements ReaderInterface {
  constructor(
    @InjectRepository(RegisteProject)
    private registeProjectRepository: Repository<RegisteProject>,
  ) {}

  async read() {
    const target = await this.registeProjectRepository.find();

    return target;
  }
}
