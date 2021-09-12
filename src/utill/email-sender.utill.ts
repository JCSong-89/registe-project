import { NotAcceptableException } from '@nestjs/common';
import { send, setApiKey } from '@sendgrid/mail';
import { UploadFileMetadataDto } from 'src/file/dto/upload-file-meta-data.dto';

export const emailSend = async (data: any, files: UploadFileMetadataDto[], admins: any) => {
  const { email, CEOName, telephone, company } = data;
  const attachments = [];

  for (const i of files) {
    const attachment = Buffer.from(i.buffer).toString('base64');
    attachments.push({
      content: attachment,
      filename: i.originalname,
      type: i.mimetype,
      disposition: 'attachment',
    });
  }

  if(admins.length === 0 ){
    return { status: 200, message: '완료'}; 
  }

  setApiKey(process.env.AZURE_SENDGRID_API_KEY);

  const messageToAdmin = {
    from: 'no-reply@registeProject.com',
    to: admins,
    templateId: `${process.env.AZURE_SENDGRID_SEND_RECEIVE}`,
    subject: '프로젝트등록 신청이 발생하였습니다.',
    dynamicTemplateData: {
      email,
      CEOName,
      telephone,
      company,
    },
    attachments,
    hideWarning: true,
  };

  const result = await send(messageToAdmin)

    .then(() => {
      return { status: 200, message: '발송완료' };
    })
    .catch((e) => {
      console.log(e)
      throw new NotAcceptableException({
        status: 406,
        message: '관리자에게 발송에 실패하였습니다.',
      });
    });

  if (result.status !== 200) {
    throw new NotAcceptableException({
      status: 406,
      message: '관리자에게 발송에 실패하였습니다.',
    });
  }
  
  const messageToregiste = {
    from: 'no-reply@registeProject.com',
    to: data.email,
    subject: '프로젝트등록 접수가 완료되었습니다.',
    templateId: `${process.env.AZURE_SENDGRID_SEND_CONFIRMATION}`,
    hideWarning: true,
  };
  return await send(messageToregiste)
    .then(() => {
      return { status: 200, message: '발송완료' };
    })
    .catch(e => {
      console.log(e.response.body);
      throw new NotAcceptableException({
        status: 406,
        message: '접수자에게 발송에 실패하였습니다.',
      });
    });
};
