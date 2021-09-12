import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigOptions } from '../common/enum/config-option.enm';
import { JwtModuleOptions } from './jwt.inferface';
import { JwtSigner } from './service/jwt.signer';
import { JwtVerifier } from './service/jwt.verifier.';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: ConfigOptions.JWT,
          useValue: options,
        },
        JwtSigner,
        JwtVerifier,
      ],
      exports: [JwtSigner, JwtVerifier],
    };
  }
}
