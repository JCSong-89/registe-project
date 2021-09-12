import { ApiResponseProperty } from '@nestjs/swagger';
import { Account } from '../entity/account.entity';

export class ReadOneAccountResponseDto {
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  password: string;
  @ApiResponseProperty()
  specialPoint: string | null;
  @ApiResponseProperty()
  staffLevel: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  group: string;
  @ApiResponseProperty()
  lastLoginDate: Date | null;
  @ApiResponseProperty()
  lastLoginIP: string | null;
  @ApiResponseProperty()
  telephone: string;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  cert: boolean

  constructor(data: Account) {
    this.email = data.email;
    this.password = data.password;
    this.specialPoint = data.specialPoint;
    this.group = data.group;
    this.lastLoginDate = data.lastLoginDate;
    this.lastLoginIP = data.lastLoginIP;
    this.name = data.name;
    this.telephone = data.telephone;
    this.id = data.id;
    this.staffLevel = data.staffLevel;
    this.cert = data.cert;
  }
}
