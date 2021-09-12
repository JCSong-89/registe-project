import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-timezone';
import { Account } from 'src/account/entity/account.entity';
import { UpdaterInterface } from 'src/account/operator/operator.inferface';
import { Repository } from 'typeorm';

@Injectable()
export class AccountLastestUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async update(ip: any, id: string) {
    const targetAccount = await this.accountRepository.findOne({ id });

    if (!targetAccount) {
      throw new NotFoundException({
        status: 404,
        message: '업데이트할 계정을 찾지 못했습니다.',
      });
    }

    const lastLoginDate = moment().format('YYYY-MM-DD HH:mm');
    const lastLoginIP = ip;

    await this.accountRepository.update(targetAccount.id, {
      lastLoginDate,
      lastLoginIP,
    });

    return true;
  }
}
