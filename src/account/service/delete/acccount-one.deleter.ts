import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { DeleterInterface } from 'src/account/operator/operator.inferface';

@Injectable()
export class AccountOneDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async delete(id: string) {
    const count = await this.accountRepository.count();

    if (count <= 1) {
      return {
        status: 'failed',
        message: '1명 이상의 운영자가 존재해야 합니다.',
      };
    }

    const targetAccount = await this.accountRepository.findOne({
      id,
    });

    if (!targetAccount) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 계정을 찾지 못했습니다.',
      });
    }

    await this.accountRepository.remove(targetAccount);

    return { status: 200, message: 'success' };
  }
}
