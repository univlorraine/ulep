import { Module } from '@nestjs/common';
import { LanguageController } from './controllers/language.controller';
import { CoreModule } from '../core/core.module';
import { UniversityController } from './controllers/university.controller';
import { SecurityController } from './controllers/security.controller';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CountryController } from './controllers/country.controller';
import { ProfileController } from './controllers/profile.controller';
import { RolesGuard } from './guards/roles.guard';
import { UploadsController } from './controllers/uploads.controller';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    CountryController,
    HealthController,
    LanguageController,
    ProfileController,
    SecurityController,
    UniversityController,
    UploadsController,
    UserController,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class ApiModule {}
