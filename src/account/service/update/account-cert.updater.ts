import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { UpdaterInterface } from 'src/account/operator/operator.inferface';
import { Repository } from 'typeorm';

@Injectable()
export class AccountCertUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async update(_: any, id: string) {
    const targetAccount = await this.accountRepository.findOne({ id });

    if (!targetAccount) {
      throw new NotFoundException({
        status: 404,
        message: '업데이트할 계정을 찾지 못했습니다.',
      });
    }

    await this.accountRepository.update(targetAccount.id, {
      cert: true
    });

    return {status: 200, message: '인증되었습니다.'}
  }
}
