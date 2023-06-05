import { Module } from '@nestjs/common';
import { ProfilesModule } from './core/profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { UploadsModule } from './core/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProfilesModule,
    AuthenticationModule,
    UploadsModule,
  ],
})
export class AppModule { }
