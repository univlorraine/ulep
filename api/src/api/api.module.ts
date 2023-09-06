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
import { CountryController } from './controllers/country.controller';
import { AUTHENTICATOR } from './services/authenticator.interface';
import { KeycloakAuthenticator } from './services/keycloak.authenticator';
import { ObjectiveController } from './controllers/objective.controller';
import { CampusController } from 'src/api/controllers/campus.controller';
import { LearningLanguageController } from './controllers/learningLanguage.controller';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    CampusController,
    CountryController,
    HealthController,
    InterestController,
    LanguageController,
    MatchController,
    ObjectiveController,
    ProficiencyController,
    ProfileController,
    ReportController,
    SecurityController,
    TandemController,
    UniversityController,
    UploadsController,
    UserController,
    LearningLanguageController,
  ],
  providers: [
    {
      provide: AUTHENTICATOR,
      useClass: KeycloakAuthenticator,
    },
  ],
})
export class ApiModule {}
