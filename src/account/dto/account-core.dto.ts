import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AccountCoreDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  telephone: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  group: string;

  @ApiProperty()
  @IsOptional()
  specialPoint: string;

  @ApiProperty()
  @IsOptional()
  staffLevel: string;
}
