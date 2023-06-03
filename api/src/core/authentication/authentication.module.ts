import { Module } from '@nestjs/common';

import { ProvidersModule } from 'src/providers/providers.module';
import { AuthenticationController } from './application/authentication.controller';
import { LoginUsecase } from './usecases/login.usecase';

@Module({
  imports: [ProvidersModule],
  controllers: [AuthenticationController],
  providers: [LoginUsecase],
})
export class AuthenticationModule {}
