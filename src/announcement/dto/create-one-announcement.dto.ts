import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

class CreateAnnouncementCore {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsBoolean()
  top: boolean;
}

export class CreateOneAnnouncementRequestDto extends CreateAnnouncementCore {
  @ApiProperty()
  @IsArray()
  fileIds: string[];

  constructor() {
    super();
  }
}

export class CreateOneAnnouncementBodyDto extends CreateAnnouncementCore {
  constructor(data: any) {
    super();
    this.title = data.title;
    this.content = data.content;
    this.top = data.top;
  }
}
