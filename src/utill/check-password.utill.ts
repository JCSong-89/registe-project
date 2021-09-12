import { InternalServerErrorException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';

export async function checkPassword(
  aPassword: string,
  dbPassword: string,
): Promise<boolean> {
  try {
    const result = await bcrypt.compare(aPassword, dbPassword);
    return result;
  } catch (e) {
    console.log(e);
    throw new InternalServerErrorException({
      status: 500,
      message: '비밀번호 compare에 실패하였습니다.',
    });
  }
}
