import { Module, Provider } from '@nestjs/common';
import { PrismaService } from './persistance/prisma.service';
import { PrismaProfileRepository } from './persistance/repositories/prisma-profile-repository';
import { MinioService } from './storage/minio.service';
import { PrismaMediaObjectRepository } from './persistance/repositories/prisma-media-object-repository';
import { PrismaUniversityRepository } from './persistance/repositories/prisma-university-repository';
import { PrismaLanguageRepository } from './persistance/repositories/prisma-language-repository';
import { PrismaUserRepository } from './persistance/repositories/prisma-user-repository';
import { PrismaReportRepository } from './persistance/repositories/prisma-report-repository';
import { PrismaTandemRepository } from './persistance/repositories/prisma-tandem-repository';
import { PrismaCountryRepository } from './persistance/repositories/prisma-country-repository';
import { PrismaCEFRRepository } from './persistance/repositories/prisma-cefr-repository';

export const AUTHENTICATOR = 'authenticator';
export const CEFR_REPOSITORY = 'cefr.repository';
export const COUNTRY_REPOSITORY = 'country.repository';
export const LANGUAGE_REPOSITORY = 'language.repository';
export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';
export const PROFILE_REPOSITORY = 'profile.repository';
export const REPORT_REPOSITORY = 'report.repository';
export const STORAGE_SERVICE = 'storage.service';
export const TANDEM_REPOSITORY = 'tandem.repository';
export const UNIVERSITY_REPOSITORY = 'university.repository';
export const USER_REPOSITORY = 'user.repository';

const providers: Provider[] = [
  {
    provide: CEFR_REPOSITORY,
    useClass: PrismaCEFRRepository,
  },
  {
    provide: COUNTRY_REPOSITORY,
    useClass: PrismaCountryRepository,
  },
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
  {
    provide: STORAGE_SERVICE,
    useClass: MinioService,
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
    provide: TANDEM_REPOSITORY,
    useClass: PrismaTandemRepository,
  },
  {
    provide: UNIVERSITY_REPOSITORY,
    useClass: PrismaUniversityRepository,
  },
  {
    provide: MEDIA_OBJECT_REPOSITORY,
    useClass: PrismaMediaObjectRepository,
  },
  {
    provide: LANGUAGE_REPOSITORY,
    useClass: PrismaLanguageRepository,
  },
];

@Module({
  imports: [],
  providers: [PrismaService, ...providers],
  exports: [...providers],
})
export class ProvidersModule {}
