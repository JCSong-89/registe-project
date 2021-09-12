import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ConfigOptions } from 'src/common/enum/config-option.enm';
import { JwtModuleOptions, JwtInterface } from '../jwt.inferface';

@Injectable()
export class JwtVerifier implements JwtInterface {
  constructor(
    @Inject(ConfigOptions.JWT) private readonly options: JwtModuleOptions,
  ) {}
  operate(token: string) {
    const admin = jwt.verify(token, this.options.privateKey);

    if (admin === TokenExpiredError)
      throw new BadRequestException({
        code: 401,
        message: '토큰 유효기간 만료',
      });
    if (admin === JsonWebTokenError)
      throw new BadRequestException({
        code: 401,
        message: '유효하지 않은 토큰',
      });

    return admin;
  }
}
