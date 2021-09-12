import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateOneGalleryRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDateString()
  startedAt: Date;

  @ApiProperty()
  @IsDateString()
  finishedAt: Date;

  @ApiProperty()
  @IsBoolean()
  top: boolean;

  @ApiProperty()
  @IsOptional()
  fileIds: string[];
}
