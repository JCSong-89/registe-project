import { BadRequestException, NotAcceptableException } from '@nestjs/common';
import { send, setApiKey } from '@sendgrid/mail';
import { async } from 'crypto-random-string';
import * as cache from 'memory-cache';
import { Account } from 'src/account/entity/account.entity';

export const sendCert = async (admin: any) => {
  const min = Math.ceil(100000);
  const max = Math.floor(1000000);
  const certCode = Math.floor(Math.random() * (max - min)) + min;

  setApiKey(process.env.AZURE_SENDGRID_API_KEY);
  const messageToAdmin = {
    from: 'no-reply@registe.com',
    to: `${admin.email}`,
    templateId: `${process.env.AZURE_SENDGRID_SEND_CERT_CODE}`,
    subject: '이메일 인증코드',
    dynamicTemplateData: {
      certCode
    },
    hideWarning: true,
  };

  cache.put(admin.email, certCode)

  const result = await send(messageToAdmin)
    .then(() => {
      return { status: 200, message: '발송완료' };
    })
    .catch((e) => {
      console.log(`에러코드: ${e}`)
      return {
        status: 406,
        message: '인증코드 발송에 실패하였습니다.',
      };
    });

  if (result.status !== 200) {
    return new NotAcceptableException({
      status: 406,
      message: '인증코드 발송에 실패하였습니다.',
    });
  }

 return result
};

export const checkCertCode = async(admin: any, certCode: any) => {
  const cacheCode = cache.get(admin.email)

  if (cacheCode != certCode){
    throw new BadRequestException({
      status: 400,
      message: '인증코드가 맞지 않습니다.'
    })
  }

 return true
}