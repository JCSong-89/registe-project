import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateOneRegisteProjectRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  CEOName: string;

  @ApiProperty()
  @IsString()
  telephone: string;

  @ApiProperty()
  @IsString()
  company: string;
}
