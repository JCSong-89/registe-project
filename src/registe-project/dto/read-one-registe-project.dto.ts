import { ApiResponseProperty } from '@nestjs/swagger';
import { RegisteProject } from '../entity/registe-project.entity';
import { File } from '../../file/entity/file.entity';

export class ReadOneRegisteProjectCore {
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  CEOName: string;
  @ApiResponseProperty()
  company: string;
  @ApiResponseProperty()
  telephone: string;
  @ApiResponseProperty()
  createdAt: Date;

  constructor(data: RegisteProject) {
    this.email = data.email;
    this.CEOName = data.CEOName;
    this.company = data.company;
    this.telephone = data.telephone;
    this.createdAt = data.createdAt;
  }
}

export class ReadOneRegisteProjectAdminResponseDto extends ReadOneRegisteProjectCore {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  files: File[];

  constructor(data: RegisteProject, files: File[]) {
    super(data);
    this.id = data.id;
    this.files = files;
  }
}
