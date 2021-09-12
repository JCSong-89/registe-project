export class UploadFileMetadataDto {
  fieldname: string;
  originalname: string;
  encoding: BufferEncoding;
  mimetype: string;
  buffer: Buffer;
  size: string;
}

type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'latin1'
  | 'binary'
  | 'hex';
