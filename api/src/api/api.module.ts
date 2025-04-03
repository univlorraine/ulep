/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

// organize-imports-ignore
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
import { ConfigModule } from '@nestjs/config';
import { TandemHistoryController } from 'src/api/controllers/tandemHistory.controller';
import { NotificationController } from 'src/api/controllers/notification.controller';
import { ChatController } from 'src/api/controllers/chat.controller';
import { VocabularyController } from 'src/api/controllers/vocabulary.controller';
import { NewsController } from './controllers/news.controller';
import { ActivityController } from 'src/api/controllers/activity.controller';
import { SessionController } from './controllers/session.controller';
import { EventsController } from './controllers/events.controller';
import { LogEntryController } from 'src/api/controllers/log-entry.controller';
import { EditoController } from 'src/api/controllers/edito.controller';
@Module({
  imports: [CoreModule, TerminusModule, HttpModule, ConfigModule],
  controllers: [
    ActivityController,
    CampusController,
    ChatController,
    CountryController,
    HealthController,
    InterestController,
    InstanceController,
    LanguageController,
    LogEntryController,
    NewsController,
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
    SessionController,
    EventsController,
    EditoController,
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
