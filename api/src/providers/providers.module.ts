import { Module } from '@nestjs/common';
import { ProfilesRepository } from './persistance/repositories/profiles.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './persistance/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  providers: [ProfilesRepository],
  exports: [ProfilesRepository],
})
export class ProvidersModule {}
