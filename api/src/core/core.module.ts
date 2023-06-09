import { Module } from '@nestjs/common';
import { CreateUserUsecase } from './usecases/users/create-user.usecase';
import { ProvidersModule } from 'src/providers/providers.module';
import { UploadImageUsecase } from './usecases/uploads/upload-image.usecase';
import { ResetPasswordUsecase } from './usecases/users/reset-password.usecase';

const usecases = [CreateUserUsecase, ResetPasswordUsecase, UploadImageUsecase];

@Module({
  imports: [ProvidersModule],
  providers: usecases,
  exports: usecases,
})
export class CoreModule {}
