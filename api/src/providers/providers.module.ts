import { Module, Provider } from '@nestjs/common';
import { PrismaService } from './persistance/prisma.service';
import { PrismaProfileRepository } from './persistance/repositories/profiles.repository';
import { MinioService } from './storage/minio.service';
import { PrismaMediaObjectRepository } from './persistance/repositories/media-object.repository';
import { OrganizationRepository } from './persistance/repositories/organization.repository';
import { PrismaUniversityRepository } from './persistance/repositories/university.repository';

export const STORAGE_SERVICE = 'storage.service';
export const PROFILE_REPOSITORY = 'profile.repository';
export const UNIVERSITY_REPOSITORY = 'university.repository';
export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

const providers: Provider[] = [
  {
    provide: STORAGE_SERVICE,
    useClass: MinioService,
  },
  {
    provide: PROFILE_REPOSITORY,
    useClass: PrismaProfileRepository,
  },
  {
    provide: UNIVERSITY_REPOSITORY,
    useClass: PrismaUniversityRepository,
  },
  {
    provide: MEDIA_OBJECT_REPOSITORY,
    useClass: PrismaMediaObjectRepository,
  },
  OrganizationRepository,
];

@Module({
  providers: [PrismaService, ...providers],
  exports: [...providers],
})
export class ProvidersModule {}
