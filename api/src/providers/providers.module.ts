import { Module, Provider } from '@nestjs/common';
import { PrismaService } from './persistance/prisma.service';
import { PrismaProfileRepository } from './persistance/repositories/profiles.repository';

const providers: Provider[] = [
  {
    provide: 'profile.repository',
    useClass: PrismaProfileRepository,
  },
];

@Module({
  providers: [PrismaService, ...providers],
  exports: [...providers],
})
export class ProvidersModule {}
