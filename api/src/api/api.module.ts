import { PrismaService } from '@app/common';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { CampusController } from 'src/api/controllers/campus.controller';
import { ChatController } from 'src/api/controllers/chat.controller';
import { InstanceController } from 'src/api/controllers/instance.controller';
import { NotificationController } from 'src/api/controllers/notification.controller';
import { TandemHistoryController } from 'src/api/controllers/tandemHistory.controller';
import { VocabularyController } from 'src/api/controllers/vocabulary.controller';
import { CoreModule } from 'src/core/core.module';
import { ROUTINE_EXECUTION_REPOSITORY } from 'src/core/ports/routine-execution.repository';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { UlUniversityConnectorService } from 'src/providers/gateway/ul-university-connector';
import { PrismaRoutineExecutionRepository } from 'src/providers/persistance/repositories/prisma-routine-execution-repository';
import { MinioStorage } from 'src/providers/storage/minio.storage';
import { CountryController } from './controllers/country.controller';
import { HealthController } from './controllers/health.controller';
import { InterestController } from './controllers/interest.controller';
import { LanguageController } from './controllers/language.controller';
import { LearningLanguageController } from './controllers/learningLanguage.controller';
import { ObjectiveController } from './controllers/objective.controller';
import { ProficiencyController } from './controllers/proficiency.controller';
import { ProfileController } from './controllers/profile.controller';
import { PurgesController } from './controllers/purge.controller';
import { ReportController } from './controllers/report.controller';
import { RoutineExecutionController } from './controllers/routine-execution.controller';
import { SecurityController } from './controllers/security.controller';
import { TandemController } from './controllers/tandem.controller';
import { UniversityController } from './controllers/university.controller';
import { UniversityConnectorController } from './controllers/universityConnector.controller';
import { UploadsController } from './controllers/upload.controller';
import { UserController } from './controllers/user.controller';
import { AUTHENTICATOR } from './services/authenticator.interface';
import { KeycloakAuthenticator } from './services/keycloak.authenticator';

@Module({
  imports: [CoreModule, TerminusModule, HttpModule, ConfigModule],
  controllers: [
    CampusController,
    ChatController,
    CountryController,
    HealthController,
    InterestController,
    InstanceController,
    LanguageController,
    NotificationController,
    ObjectiveController,
    ProficiencyController,
    ProfileController,
    PurgesController,
    ReportController,
    SecurityController,
    TandemController,
    TandemHistoryController,
    UniversityController,
    UploadsController,
    UserController,
    LearningLanguageController,
    RoutineExecutionController,
    UniversityConnectorController,
    VocabularyController,
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
