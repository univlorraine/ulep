import { Module, Provider } from '@nestjs/common';
import { PrismaService } from './persistance/prisma.service';
import { PrismaProfileRepository } from './persistance/repositories/prisma-profile-repository';
import { MinioService } from './storage/minio.service';
import { PrismaMediaObjectRepository } from './persistance/repositories/prisma-media-object-repository';
import { PrismaUniversityRepository } from './persistance/repositories/prisma-university-repository';
import { PrismaCountryRepository } from './persistance/repositories/prisma-country-repository';
import { PrismaLanguageRepository } from './persistance/repositories/prisma-language-repository';
import { PrismaUserRepository } from './persistance/repositories/prisma-user-repository';

export const COUNTRY_REPOSITORY = 'country.repository';
export const LANGUAGE_REPOSITORY = 'language.repository';
export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';
export const PROFILE_REPOSITORY = 'profile.repository';
export const STORAGE_SERVICE = 'storage.service';
export const UNIVERSITY_REPOSITORY = 'university.repository';
export const USER_REPOSITORY = 'user.repository';

const providers: Provider[] = [
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
    provide: COUNTRY_REPOSITORY,
    useClass: PrismaCountryRepository,
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
  providers: [PrismaService, ...providers],
  exports: [...providers],
})
export class ProvidersModule {}
