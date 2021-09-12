import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import moment from 'moment-timezone';

export const writeFile = (data: any, filename: string) => {
  const excelDir = './excel';
  if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir);
  }
  const file = path.resolve(
    excelDir,
    `${filename}-${moment()
      .tz(process.env.TZ)
      .format('YYYYMMDDHHmmss')}.xlsx`,
  );

  // step 1. 워크북 생성
  const book = xlsx.utils.book_new();
  // step 2. 워크시트 만들기
  const sheet = xlsx.utils.json_to_sheet(data);
  // step 3. 워크북에 새로 만든 워크시트 이름을 주고 붙인다.
  xlsx.utils.book_append_sheet(book, sheet, filename);
  // step 4. 파일 생성
  xlsx.writeFile(book, file, { bookType: 'xlsx' });

  return file;
};
