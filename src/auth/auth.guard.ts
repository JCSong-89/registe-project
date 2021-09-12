import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment-timezone';
import {
  AccountReader,
  AccountUpdater,
} from 'src/account/operator/acccount.operator';
import { AccountOneReader } from 'src/account/service/read/account-one.reader';
import { AccountLastestUpdater } from 'src/account/service/update/account-lastest.updater';
import { TokenInformation } from 'src/jwt/dto/token-infomation.dto';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { JwtVerifier } from 'src/jwt/service/jwt.verifier.';
import * as cache from 'memory-cache';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly accountOneReader: AccountOneReader,
    private accountReader: AccountReader,
    private readonly accountLastestUpdater: AccountLastestUpdater,
    private accountUpdater: AccountUpdater,

    private readonly jwtVerifier: JwtVerifier,
    private jwtOperater: JwtOperater,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    AuthGuard.logger.log(`Authorization: ${authorization}`);
    if (!authorization) {
      throw new UnauthorizedException({
        status: 401,
        message: '인증되지 않았습니다.',
      });
    }

    const [scheme, accessToken] = authorization.split(' ');
    AuthGuard.logger.log(`Scheme: ${scheme}, AccessToken: ${accessToken}`);

    if (scheme.toLowerCase() !== 'bearer') {
      throw new NotImplementedException({
        status: 501,
        message: '지원되지 않는 인증토큰 유형 입니다.',
      });
    }

    const memoryToken = cache.get(accessToken);

    if (!memoryToken) {
      throw new UnauthorizedException({
        status: 401,
        message: '최근 발급된 토큰과 같지 않습니다.',
      });
    }

    this.jwtOperater.setOperator(this.jwtVerifier);
    const adminInformation = new TokenInformation(
      await this.jwtOperater.operate(accessToken),
    );

    if (memoryToken !== adminInformation.adminId) {
      throw new UnauthorizedException({
        status: 401,
        message: '최근 발급된 토큰의 ID와 같지 않습니다.',
      });
    }

    request.adminId = { id: adminInformation.adminId };
    const exp = adminInformation.expiresIn;

    if (moment(exp).isBefore(moment())) {
      cache.del(adminInformation.adminId);
      throw new UnauthorizedException({
        status: 401,
        message: '인증토큰이 만료 되었습니다.',
      });
    }

    this.accountReader.setOperator(this.accountOneReader);
    const result = await this.accountReader.read({ id: request.adminId.id });

    if (!result) {
      cache.del(adminInformation.adminId);
      throw new NotFoundException({
        status: 404,
        message: '해당 토큰의 어드민이 DB에 존재하지 않습니다.',
      });
    }

    this.accountUpdater.setOperator(this.accountLastestUpdater);
    await this.accountUpdater.update(request.clientIp, result.id);
    request.admin = result;

    return true;
  }
}
