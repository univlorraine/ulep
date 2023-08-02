import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from 'src/core/core.module';
import { HealthController } from './controllers/health.controller';
import { InterestController } from './controllers/interest.controller';
import { LanguageController } from './controllers/language.controller';
import { MatchController } from './controllers/match.controller';
import { ProficiencyController } from './controllers/proficiency.controller';
import { ReportController } from './controllers/report.controller';
import { SecurityController } from './controllers/security.controller';
import { TandemController } from './controllers/tandem.controller';
import { UniversityController } from './controllers/university.controller';
import { UploadsController } from './controllers/upload.controller';
import { UserController } from './controllers/user.controller';
import { ProfileController } from './controllers/profile.controller';
import { CountryController } from './controllers/county.controller';
import { AUTHENTICATOR } from './services/authenticator.interface';
import { KeycloakAuthenticator } from './services/keycloak.authenticator';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    CountryController,
    HealthController,
    InterestController,
    LanguageController,
    MatchController,
    ProficiencyController,
    ProfileController,
    ReportController,
    SecurityController,
    TandemController,
    UniversityController,
    UploadsController,
    UserController,
  ],
  providers: [
    {
      provide: AUTHENTICATOR,
      useClass: KeycloakAuthenticator,
    },
  ],
})
export class ApiModule {}
