import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import Profile from './profiles.entity';
import { AuthenticationModule } from 'src/common/authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), AuthenticationModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
