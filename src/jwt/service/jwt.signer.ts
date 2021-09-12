import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import { ConfigOptions } from 'src/common/enum/config-option.enm';
import { JwtModuleOptions, JwtInterface } from '../jwt.inferface';

@Injectable()
export class JwtSigner implements JwtInterface {
  constructor(
    @Inject(ConfigOptions.JWT) private readonly options: JwtModuleOptions,
  ) {}
  operate(adminId: string) {
    const expiresIn = moment()
      .add(process.env.TOKEN_EXPIRATION, 'seconds')
      .toDate();
    const token = jwt.sign({ adminId, expiresIn }, this.options.privateKey);

    return { token, expiresIn };
  }
}
