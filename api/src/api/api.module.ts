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
import { ReportController } from './controllers/report.controller';
import { ReportCategoriesController } from './controllers/report-categories.controller';
import { UuidProvider } from './services/uuid-provider';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    CountryController,
    ExportController,
    HealthController,
    LanguageController,
    MatchController,
    ProfileController,
    ReportController,
    ReportCategoriesController,
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
    UuidProvider,
  ],
})
export class ApiModule {}
