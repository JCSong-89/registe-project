import { IsString } from "class-validator";

export class CertCodeRequestDto{
  @IsString()
  certCode: string
}