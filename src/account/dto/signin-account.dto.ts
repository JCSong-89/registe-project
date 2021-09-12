import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import moment from 'moment-timezone';

export class SigninAccountRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SigninAccountResponseDto {
  @ApiResponseProperty()
  access_token: string;
  @ApiResponseProperty()
  expires_in: number;

  constructor(token: string, exp: Date) {
    this.access_token = token;
    this.expires_in = moment(exp).diff(moment(), 'seconds');
  }
}
