import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { CreateProfileUsecase } from './usecases/create-profile.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/providers/persistance/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [ProfilesController],
  providers: [CreateProfileUsecase],
})
export class ProfilesModule {}
