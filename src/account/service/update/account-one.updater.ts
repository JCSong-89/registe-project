import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { UpdaterInterface } from 'src/account/operator/operator.inferface';
import { UpdateOneAccountRequestDto } from 'src/account/dto/update-one-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountOneUpdater implements UpdaterInterface {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async update(bodyData: UpdateOneAccountRequestDto, id: string) {
    const targetAccount = await this.accountRepository.findOne({ id });
    const data = {
      name: bodyData.name,
      group: bodyData.group,
      specialPoint: bodyData.specialPoint || null,
      staffLevel: bodyData.staffLevel || null,
      telephone: bodyData.telephone,
    };

    if (!targetAccount) {
      throw new NotFoundException({
        status: 404,
        message: '업데이트할 계정을 찾지 못했습니다.',
      });
    }

    if (targetAccount.password === bodyData.password) {
      await this.accountRepository.update(targetAccount.id, {
        ...bodyData,
      });
    } else {
      const password = await bcrypt.hash(bodyData.password, 10);
      await this.accountRepository.update(targetAccount.id, {
        ...data,
        password,
      });
    }

    return { status: 200, message: 'success' };
  }
}
