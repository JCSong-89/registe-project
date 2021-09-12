import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { AccountCoreDto } from './account-core.dto';

export class CreateOneAccountRequestDto extends AccountCoreDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
