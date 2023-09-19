import { Module, Provider } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { COUNTRY_REPOSITORY } from 'src/core/ports/country.repository';
import { PrismaCountryCodeRepository } from './persistance/repositories/prisma-country.repository';
import { INTEREST_REPOSITORY } from 'src/core/ports/interest.repository';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import { PrismaLanguageRepository } from './persistance/repositories/prisma-language.repository';
import { MEDIA_OBJECT_REPOSITORY } from 'src/core/ports/media-object.repository';
import { PrismaMediaObjectRepository } from './persistance/repositories/prisma-media-object-repository';
import { PROFICIENCY_REPOSITORY } from 'src/core/ports/proficiency.repository';
import { PrismaProficiencyRepository } from './persistance/repositories/prisma-proficiency.repository';
import { PROFILE_REPOSITORY } from 'src/core/ports/profile.repository';
import { PrismaProfileRepository } from './persistance/repositories/prisma-profile-repository';
import { REPORT_REPOSITORY } from 'src/core/ports/report.repository';
import { PrismaReportRepository } from './persistance/repositories/prisma-report.repository';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { MinioStorage } from './storage/minio.storage';
import { TANDEM_REPOSITORY } from 'src/core/ports/tandems.repository';
import { PrismaTandemRepository } from './persistance/repositories/prisma-tandem-repository';
import { UNIVERSITY_REPOSITORY } from 'src/core/ports/university.repository';
import { PrismaUniversityRepository } from './persistance/repositories/prisma-university.repository';
import { USER_REPOSITORY } from 'src/core/ports/user.repository';
import { PrismaUserRepository } from './persistance/repositories/prisma-user.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from './services/uuid.provider';
import { PrismaInterestRepository } from './persistance/repositories/prisma-interest.repository';
import { OBJECTIVE_REPOSITORY } from 'src/core/ports/objective.repository';
import { PrismaObjectiveRepository } from './persistance/repositories/prisma-objective.repository';
import { CAMPUS_REPOSITORY } from 'src/core/ports/campus.repository';
import { PrismaCampusRepository } from 'src/providers/persistance/repositories/prisma-campus.repository';
import { LEARNING_LANGUAGE_REPOSITORY } from 'src/core/ports/learning-language.repository';
import { PrismaLearningLanguageRepository } from './persistance/repositories/prisma-learning-language-repository';
import { ROUTINE_EXECUTION_REPOSITORY } from 'src/core/ports/routine-execution.repository';
import { PrismaRoutineExecutionRepository } from './persistance/repositories/prisma-routine-execution-repository';
import { REFUSED_TANDEMS_REPOSITORY } from 'src/core/ports/refused-tandems.repository';
import { PrismaRefusedTandemsRepository } from './persistance/repositories/prisma-refused-tandems.repository';
import { EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import { SmtpEmailGateway } from './gateway/smtp-email.gateway';

const providers: Provider[] = [
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
];

@Module({
  imports: [],
  providers: [PrismaService, ...providers],
  exports: [...providers],
})
export class ProvidersModule {}
