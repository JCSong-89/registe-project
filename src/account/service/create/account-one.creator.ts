import { Repository } from 'typeorm';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { CreatorInterface } from '../../operator/operator.inferface';
import { CreateOneAccountRequestDto } from 'src/account/dto/create-one-account.dto';

@Injectable()
export class AccountOneCreator implements CreatorInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(bodyData: CreateOneAccountRequestDto) {
    const isExist = await this.accountRepository.findOne({
      email: bodyData.email,
    });

    if (isExist) {
      return {
        status: 'failed',
        message: '해당 이메일로 등록된 계정이 있습니다.',
      };
    }

    const createAccount = this.accountRepository.create({
      ...bodyData,
    });
    const account = await this.accountRepository.save(createAccount);

    if (!account) {
      throw new InternalServerErrorException({
        status: 500,
        message: '유저가 생성이 되지 않았습니다.',
      });
    }

    return { status: 200, message: 'success' };
  }
}
