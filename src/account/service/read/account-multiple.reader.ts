import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { ReaderInterface } from 'src/account/operator/operator.inferface';

@Injectable()
export class AccountMultipleReader implements ReaderInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async read(_: any, size: number, page: number) {
    return await this.accountRepository
      .createQueryBuilder('Accounts')
      .orderBy('Accounts.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }
}
