import { Module } from '@nestjs/common';
import { ProfilesController } from './application/profiles.controller';
import { CreateProfileUsecase } from './usecases/create-profile.usecase';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [ProfilesController],
  providers: [CreateProfileUsecase],
})
export class ProfilesModule {}
