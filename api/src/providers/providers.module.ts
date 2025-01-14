import { PrismaService } from '@app/common';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ACTIVITY_REPOSITORY } from 'src/core/ports/activity.repository';
import { CAMPUS_REPOSITORY } from 'src/core/ports/campus.repository';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { COMMUNITY_CHAT_REPOSITORY } from 'src/core/ports/community-chat.repository';
import { CONTACT_REPOSITORY } from 'src/core/ports/contact.repository';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import { CUSTOM_LEARNING_GOAL_REPOSITORY } from 'src/core/ports/custom-learning-goal.repository';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { EVENT_REPOSITORY } from 'src/core/ports/event.repository';
import { INSTANCE_REPOSITORY } from 'src/core/ports/instance.repository';
import { INTEREST_REPOSITORY } from 'src/core/ports/interest.repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { LEARNING_LANGUAGE_REPOSITORY } from 'src/core/ports/learning-language.repository';
import { LOG_ENTRY_REPOSITORY } from 'src/core/ports/log-entry.repository';
import { MEDIA_OBJECT_REPOSITORY } from 'src/core/ports/media-object.repository';
import { NEWS_REPOSITORY } from 'src/core/ports/news.repository';
import { NOTIFICATION_GATEWAY } from 'src/core/ports/notification.gateway';
import { OBJECTIVE_REPOSITORY } from 'src/core/ports/objective.repository';
import { PDF_SERVICE } from 'src/core/ports/pdf.service';
import { PROFICIENCY_REPOSITORY } from 'src/core/ports/proficiency.repository';
import { PROFILE_REPOSITORY } from 'src/core/ports/profile.repository';
import { PURGE_REPOSITORY } from 'src/core/ports/purge.repository';
import { REFUSED_TANDEMS_REPOSITORY } from 'src/core/ports/refused-tandems.repository';
import { REPORT_REPOSITORY } from 'src/core/ports/report.repository';
import { ROUTINE_EXECUTION_REPOSITORY } from 'src/core/ports/routine-execution.repository';
import { SESSION_REPOSITORY } from 'src/core/ports/session.repository';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { TANDEM_HISTORY_REPOSITORY } from 'src/core/ports/tandem-history.repository';
import { TANDEM_REPOSITORY } from 'src/core/ports/tandem.repository';
import { TESTED_LANGUAGE_REPOSITORY } from 'src/core/ports/tested-language.repository';
import { UNIVERSITY_REPOSITORY } from 'src/core/ports/university.repository';
import { USER_REPOSITORY } from 'src/core/ports/user.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { VOCABULARY_REPOSITORY } from 'src/core/ports/vocabulary.repository';
import { FCMNotificationGateway } from 'src/providers/gateway/fcm-notification.gateway';
import { PrismaActivityRepository } from 'src/providers/persistance/repositories/prisma-activity-repository';
import { PrismaCampusRepository } from 'src/providers/persistance/repositories/prisma-campus.repository';
import { PrismaCommunityChatRepository } from 'src/providers/persistance/repositories/prisma-community-chat-repository';
import { PrismaContactRepository } from 'src/providers/persistance/repositories/prisma-contact-repository';
import { PrismaInstanceRepository } from 'src/providers/persistance/repositories/prisma-instance.repository';
import { PrismaLogEntryRepository } from 'src/providers/persistance/repositories/prisma-log-entry-repository';
import { PrismaTandemHistoryRepository } from 'src/providers/persistance/repositories/prisma-tandem-history-repository';
import { PrismaTestedLanguageRepository } from 'src/providers/persistance/repositories/prisma-tested-language-repository';
import { PrismaVocabularyRepository } from 'src/providers/persistance/repositories/prisma-vocabulary-repository';
import { ChatService } from 'src/providers/services/chat.service';
import { PdfService } from 'src/providers/services/pdf.service';
import { SmtpEmailGateway } from './gateway/smtp-email.gateway';
import { PrismaCountryCodeRepository } from './persistance/repositories/prisma-country.repository';
import { PrismaCustomLearningGoalRepository } from './persistance/repositories/prisma-custom-learning-goal-repository';
import { PrismaEventRepository } from './persistance/repositories/prisma-events.repository';
import { PrismaInterestRepository } from './persistance/repositories/prisma-interest.repository';
import { PrismaLanguageRepository } from './persistance/repositories/prisma-language.repository';
import { PrismaLearningLanguageRepository } from './persistance/repositories/prisma-learning-language-repository';
import { PrismaMediaObjectRepository } from './persistance/repositories/prisma-media-object-repository';
import { PrismaNewsRepository } from './persistance/repositories/prisma-news-repository';
import { PrismaObjectiveRepository } from './persistance/repositories/prisma-objective.repository';
import { PrismaProficiencyRepository } from './persistance/repositories/prisma-proficiency.repository';
import { PrismaProfileRepository } from './persistance/repositories/prisma-profile-repository';
import { PrismaPurgeRepository } from './persistance/repositories/prisma-purge.repository';
import { PrismaRefusedTandemsRepository } from './persistance/repositories/prisma-refused-tandems.repository';
import { PrismaReportRepository } from './persistance/repositories/prisma-report.repository';
import { PrismaRoutineExecutionRepository } from './persistance/repositories/prisma-routine-execution-repository';
import { PrismaSessionRepository } from './persistance/repositories/prisma-session-repository';
import { PrismaTandemRepository } from './persistance/repositories/prisma-tandem-repository';
import { PrismaUniversityRepository } from './persistance/repositories/prisma-university.repository';
import { PrismaUserRepository } from './persistance/repositories/prisma-user.repository';
import { UuidProvider } from './services/uuid.provider';
import { MinioStorage } from './storage/minio.storage';

const providers: Provider[] = [
  { provide: INSTANCE_REPOSITORY, useClass: PrismaInstanceRepository },
  {
    provide: CAMPUS_REPOSITORY,
    useClass: PrismaCampusRepository,
  },
  {
    provide: COUNTRY_REPOSITORY,
    useClass: PrismaCountryCodeRepository,
  },
  {
    provide: INTEREST_REPOSITORY,
    useClass: PrismaInterestRepository,
  },
  {
    provide: LANGUAGE_REPOSITORY,
    useClass: PrismaLanguageRepository,
  },
  {
    provide: MEDIA_OBJECT_REPOSITORY,
    useClass: PrismaMediaObjectRepository,
  },
  {
    provide: NEWS_REPOSITORY,
    useClass: PrismaNewsRepository,
  },
  {
    provide: OBJECTIVE_REPOSITORY,
    useClass: PrismaObjectiveRepository,
  },
  {
    provide: PROFICIENCY_REPOSITORY,
    useClass: PrismaProficiencyRepository,
  },
  {
    provide: PROFILE_REPOSITORY,
    useClass: PrismaProfileRepository,
  },
  {
    provide: PURGE_REPOSITORY,
    useClass: PrismaPurgeRepository,
  },
  {
    provide: REPORT_REPOSITORY,
    useClass: PrismaReportRepository,
  },
  {
    provide: STORAGE_INTERFACE,
    useClass: MinioStorage,
  },
  {
    provide: TANDEM_REPOSITORY,
    useClass: PrismaTandemRepository,
  },
  {
    provide: TANDEM_HISTORY_REPOSITORY,
    useClass: PrismaTandemHistoryRepository,
  },
  {
    provide: UNIVERSITY_REPOSITORY,
    useClass: PrismaUniversityRepository,
  },
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
  {
    provide: UUID_PROVIDER,
    useClass: UuidProvider,
  },
  {
    provide: LEARNING_LANGUAGE_REPOSITORY,
    useClass: PrismaLearningLanguageRepository,
  },
  {
    provide: TESTED_LANGUAGE_REPOSITORY,
    useClass: PrismaTestedLanguageRepository,
  },
  {
    provide: ROUTINE_EXECUTION_REPOSITORY,
    useClass: PrismaRoutineExecutionRepository,
  },
  {
    provide: REFUSED_TANDEMS_REPOSITORY,
    useClass: PrismaRefusedTandemsRepository,
  },
  {
    provide: EMAIL_GATEWAY,
    useClass: SmtpEmailGateway,
  },
  {
    provide: NOTIFICATION_GATEWAY,
    useClass: FCMNotificationGateway,
  },
  {
    provide: CONTACT_REPOSITORY,
    useClass: PrismaContactRepository,
  },
  {
    provide: CHAT_SERVICE,
    useClass: ChatService,
  },
  {
    provide: VOCABULARY_REPOSITORY,
    useClass: PrismaVocabularyRepository,
  },
  {
    provide: PDF_SERVICE,
    useClass: PdfService,
  },
  {
    provide: ACTIVITY_REPOSITORY,
    useClass: PrismaActivityRepository,
  },
  {
    provide: SESSION_REPOSITORY,
    useClass: PrismaSessionRepository,
  },
  {
    provide: EVENT_REPOSITORY,
    useClass: PrismaEventRepository,
  },
  {
    provide: CUSTOM_LEARNING_GOAL_REPOSITORY,
    useClass: PrismaCustomLearningGoalRepository,
  },
  {
    provide: LOG_ENTRY_REPOSITORY,
    useClass: PrismaLogEntryRepository,
  },
  {
    provide: COMMUNITY_CHAT_REPOSITORY,
    useClass: PrismaCommunityChatRepository,
  },
];

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, ...providers],
  exports: [...providers],
})
export class ProvidersModule {}
