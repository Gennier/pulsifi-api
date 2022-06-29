import { Global, Module } from '@nestjs/common';
import { PasswordCipher } from './utils/password-ciper';

@Global()
@Module({
  imports: [],
  providers: [PasswordCipher],
  exports: [PasswordCipher],
})
export class SharedModule {}
