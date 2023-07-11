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
import { MatchController } from './controllers/match.controller';
import { ExportController } from './controllers/export.controller';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    CountryController,
    ExportController,
    HealthController,
    LanguageController,
    MatchController,
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
