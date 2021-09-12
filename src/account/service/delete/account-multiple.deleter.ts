import { In, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleterInterface } from 'src/account/operator/operator.inferface';
import { Account } from 'src/account/entity/account.entity';

@Injectable()
export class AccountMultipleDeleter implements DeleterInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async delete(ids: string[]) {
    const count = await this.accountRepository.count();

    if (count <= 1 || count - ids.length < 1) {
      return {
        status: 'failed',
        message: '1명 이상의 운영자가 존재해야 합니다.',
      };
    }

    let idsArray = [];
    if (typeof ids !== 'object') {
      idsArray.push(ids);
    } else {
      idsArray = ids;
    }

    const targetAccounts = await this.accountRepository.find({
      where: {
        id: In(idsArray),
      },
    });

    if (targetAccounts.length === 0) {
      throw new NotFoundException({
        status: 404,
        message: '삭제할 계정을 찾지 못했습니다.',
      });
    }

    await this.accountRepository.remove(targetAccounts);

    return { status: 200, message: 'success' };
  }
}
