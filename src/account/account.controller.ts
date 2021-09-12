import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtOperater } from 'src/jwt/jwt.operator';
import { JwtSigner } from 'src/jwt/service/jwt.signer';
import { checkPassword } from 'src/utill/check-password.utill';
import { CreateOneAccountRequestDto } from './dto/create-one-account.dto';
import {
  SigninAccountRequestDto,
  SigninAccountResponseDto,
} from './dto/signin-account.dto';
import {
  AccountCreator,
  AccountDeleter,
  AccountReader,
  AccountUpdater,
} from './operator/acccount.operator';
import { AccountOneCreator } from './service/create/account-one.creator';
import { AccountOneReader } from './service/read/account-one.reader';
import { Auth } from 'src/auth/auth.decorator';
import { AccountMultipleReader } from './service/read/account-multiple.reader';
import { AccountOneDeleter } from './service/delete/acccount-one.deleter';
import { AccountMultipleDeleter } from './service/delete/account-multiple.deleter';
import { AccountOneUpdater } from './service/update/account-one.updater';
import { UpdateOneAccountRequestDto } from './dto/update-one-account.dto';
import { ReadOneAccountResponseDto } from './dto/read-one-account.dto';
import { MessageStatusCoreDto } from 'src/common/dto/message-status-core.dto';
import {
  ReadAccountAdminResponseDto,
  ReadAccountPageAdminResponseDto,
} from './dto/read-multiple-account.dto';
import * as cache from 'memory-cache';
import { AccountCertUpdater } from './service/update/account-cert.updater';
import { checkCertCode, sendCert } from 'src/utill/cert-sender.utill';
import { CertCodeRequestDto } from './dto/cert-code.dto';

@ApiTags('운영자관리')
@Controller('/v1/admin/accounts')
export class AccountController {
  constructor(
    private readonly accountOneCreator: AccountOneCreator,
    private readonly accountOneReader: AccountOneReader,
    private readonly accountMultipleReader: AccountMultipleReader,
    private readonly accountOneUpdater: AccountOneUpdater,
    private readonly accountCertUpdater: AccountCertUpdater,
    private readonly accountOneDeleter: AccountOneDeleter,
    private readonly accountMultipleDeleter: AccountMultipleDeleter,

    private accountCreator: AccountCreator,
    private accountReader: AccountReader,
    private accountUpdater: AccountUpdater,
    private accountDeleter: AccountDeleter,

    private jwtOperater: JwtOperater,
    private readonly jwtSigner: JwtSigner,
  ) {}

  @ApiOkResponse({ type: SigninAccountResponseDto })
  @Post('login')
  async signin(@Body() bodyData: SigninAccountRequestDto) {
    this.accountReader.setOperator(this.accountOneReader);
    const admin = await this.accountReader.read({ email: bodyData.email });

    if (!admin) {
      return {
        status: 404,
        message: '해당 계정이 존재하지 않습니다.',
      };
    }

    const result = await checkPassword(bodyData.password, admin.password);

    if (!result) {
      return {
        status: 400,
        message: '해당 비밀번호가 잘못되었습니다.',
      };
    }

    this.jwtOperater.setOperator(this.jwtSigner);
    const { token, expiresIn } = await this.jwtOperater.operate(admin.id);
    cache.put(token, admin.id);

    return new SigninAccountResponseDto(token, expiresIn);
  }

  @Get('logout')
  @ApiBearerAuth('Authorization')
  @Auth()
  async signout(@Req() req: any) {
    cache.del(req.admin.id);
    const result = { status: 200, message: '로그아웃' };

    return new MessageStatusCoreDto(result);
  }

  @Get('email-cert/:accountId')
  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({ type: MessageStatusCoreDto })
  @ApiParam({name: 'accountId'})
  @Auth()
  async sendCert(@Param('accountId') accountId: string) {
    const admin = await this.getOne(accountId)
    const result = await sendCert(admin)

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({ type: MessageStatusCoreDto })
  @Auth()
  @ApiParam({ name: 'accountId' })
  @Put('email-cert/:accountId')
  async checkCertCode(@Body() bodyData: CertCodeRequestDto, @Param('accountId') accountId: string) {
   const admin = await this.getOne(accountId)

   await checkCertCode(admin, bodyData.certCode)
   
   this.accountUpdater.setOperator(this.accountCertUpdater)
   const result = await this.accountUpdater.update(null, accountId)
   
   cache.del(admin.email);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({ type: MessageStatusCoreDto })
  @Auth()
  @Post()
  async create(@Body() bodyData: CreateOneAccountRequestDto) {
    this.accountCreator.setOperator(this.accountOneCreator);
    const result = await this.accountCreator.create(bodyData);

    return new MessageStatusCoreDto(result);
  }

  @ApiOkResponse({ type: ReadOneAccountResponseDto })
  @ApiBearerAuth('Authorization')
  @Auth()
  @ApiParam({ name: 'accountId'})
  @Get(':accountId')
  async getOne(@Param('accountId') accountId: string) {
    this.accountReader.setOperator(this.accountOneReader);
    const admin = await this.accountReader.read({ id: accountId });

    return new ReadOneAccountResponseDto(admin);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: ReadAccountPageAdminResponseDto })
  @Auth()
  @Get()
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getMany(@Query('size') size: number, @Query('page') page: number) {
    this.accountReader.setOperator(this.accountMultipleReader);
    const [accounts, count] = await this.accountReader.read(
      null,
      size || 10,
      page || 1,
    );

    const data = accounts.map(
      account => new ReadAccountAdminResponseDto(account),
    );

    return new ReadAccountPageAdminResponseDto(
      data,
      count,
      size || 10,
      page || 1,
    );
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @ApiParam({ name: 'accountId' })
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Put(':accountId')
  async updateOne(
    @Body() bodyData: UpdateOneAccountRequestDto,
    @Param('accountId') accountId: string,
  ) {
    this.accountUpdater.setOperator(this.accountOneUpdater);
    const result = await this.accountUpdater.update(bodyData, accountId);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiParam({ name: 'accountId' })
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @Auth()
  @Delete(':accountId')
  async deleteOne(@Param('accountId') accountId: string) {
    this.accountDeleter.setOperator(this.accountOneDeleter);
    const result = await this.accountDeleter.delete(accountId);

    return new MessageStatusCoreDto(result);
  }

  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: MessageStatusCoreDto })
  @ApiQuery({ name: 'accountIds', required: true })
  @Auth()
  @Delete()
  async deleteMany(@Query('accountIds') accountIds: string[]) {
    this.accountDeleter.setOperator(this.accountMultipleDeleter);
    const result = await this.accountDeleter.delete(accountIds);

    return new MessageStatusCoreDto(result);
  }


}
