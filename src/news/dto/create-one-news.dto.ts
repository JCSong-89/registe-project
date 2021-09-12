import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateOneNewsRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsDateString()
  reportDate: Date;

  @ApiProperty()
  @IsString()
  media: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsBoolean()
  top: boolean;
}
