import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiNotImplementedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { VerifiedTokenErrorDto } from './dto/verified-token-error.dto';

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiUnauthorizedResponse({
      type: VerifiedTokenErrorDto,
    }),
    ApiNotImplementedResponse({
      type: VerifiedTokenErrorDto,
    }),
    ApiBadRequestResponse({
      type: VerifiedTokenErrorDto,
    }),
    ApiForbiddenResponse({
      type: VerifiedTokenErrorDto,
    }),
  );
}
