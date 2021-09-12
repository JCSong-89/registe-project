import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { ReaderInterface } from '../../operator/operator.inferface';

@Injectable()
export class AccountOneReader implements ReaderInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async read(data: any) {
    const targetAccount = await this.accountRepository.findOne(data);

    if (!targetAccount) {

        throw new NotFoundException({
          status: 404,
          message: '해당 어드민 계정을 조회할 수 없습니다.',
        });
    }
    
    return targetAccount;
  }
}
