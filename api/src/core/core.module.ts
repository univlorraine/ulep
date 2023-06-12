import { Module } from '@nestjs/common';
import { CreateUserUsecase } from './usecases/users/create-user.usecase';
import { ProvidersModule } from 'src/providers/providers.module';
import { UploadImageUsecase } from './usecases/uploads/upload-image.usecase';
import { ResetPasswordUsecase } from './usecases/users/reset-password.usecase';
import { CreateUniversityUsecase } from './usecases/universities/create-university.usecase';
import { UpdateUniversityUsecase } from './usecases/universities/update-university.usecase';
import { GetUniversitiesUsecase } from './usecases/universities/get-universities.usecase';
import { DeleteUniversityUsecase } from './usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from './usecases/universities/get-university.usecase';

const usecases = [
  CreateUserUsecase,
  ResetPasswordUsecase,
  UploadImageUsecase,
  GetUniversitiesUsecase,
  GetUniversityUsecase,
  CreateUniversityUsecase,
  UpdateUniversityUsecase,
  DeleteUniversityUsecase,
];

@Module({
  imports: [ProvidersModule],
  providers: [...usecases],
  exports: [...usecases],
})
export class CoreModule {}
