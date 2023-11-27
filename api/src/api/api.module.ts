import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from 'src/core/core.module';
import { HealthController } from './controllers/health.controller';
import { InterestController } from './controllers/interest.controller';
import { LanguageController } from './controllers/language.controller';
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
import { ROUTINE_EXECUTION_REPOSITORY } from 'src/core/ports/routine-execution.repository';
import { PrismaRoutineExecutionRepository } from 'src/providers/persistance/repositories/prisma-routine-execution-repository';
import { PrismaService } from '@app/common';
import { RoutineExecutionController } from './controllers/routine-execution.controller';
import { InstanceController } from 'src/api/controllers/instance.controller';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { MinioStorage } from 'src/providers/storage/minio.storage';
import { HttpModule } from '@nestjs/axios';
import { UniversityConnectorController } from './controllers/universityConnector.controller';
import { UlUniversityConnectorService } from 'src/providers/gateway/ul-university-connector';
import { PurgesController } from './controllers/purge.controller';

@Module({
  imports: [CoreModule, TerminusModule, HttpModule],
  controllers: [
    CampusController,
    CountryController,
    HealthController,
    InterestController,
    InstanceController,
    LanguageController,
    ObjectiveController,
    ProficiencyController,
    ProfileController,
    PurgesController,
    ReportController,
    SecurityController,
    TandemController,
    UniversityController,
    UploadsController,
    UserController,
    LearningLanguageController,
    RoutineExecutionController,
    UniversityConnectorController,
  ],
  providers: [
    PrismaService,
    {
      provide: AUTHENTICATOR,
      useClass: KeycloakAuthenticator,
    },
    {
      provide: ROUTINE_EXECUTION_REPOSITORY,
      useClass: PrismaRoutineExecutionRepository,
    },
    {
      provide: STORAGE_INTERFACE,
      useClass: MinioStorage,
    },
    UlUniversityConnectorService,
  ],
})
export class ApiModule {}
