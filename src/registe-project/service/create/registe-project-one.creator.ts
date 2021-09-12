import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOneRegisteProjectRequestDto } from 'src/registe-project/dto/create-one-registe-project.dto';
import { RegisteProject } from 'src/registe-project/entity/registe-project.entity';
import { CreatorInterface } from 'src/registe-project/operator/operator.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RegisteProjectOneCreator implements CreatorInterface {
  constructor(
    @InjectRepository(RegisteProject)
    private registeProjectRepository: Repository<RegisteProject>,
  ) {}

  async create(bodyData: CreateOneRegisteProjectRequestDto) {
    const createregisteProject = this.registeProjectRepository.create({
      ...bodyData,
    });
    const registeProject = await this.registeProjectRepository.save(createregisteProject);

    if (!registeProject) {
      throw new InternalServerErrorException({
        status: 500,
        message: '프로젝트 등록이 되지않았습니다.',
      });
    }

    return registeProject;
  }
}
