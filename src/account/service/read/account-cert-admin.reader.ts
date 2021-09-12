import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { ReaderInterface } from 'src/account/operator/operator.inferface';

@Injectable()
export class AccountCertAdminReader implements ReaderInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async read() {
    return await this.accountRepository.find({
      where: {
        cert: true
      },
      select: ['email']
    })
  }
}