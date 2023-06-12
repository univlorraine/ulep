import { Module } from '@nestjs/common';
import { LanguagesController } from './controllers/languages.controller';
import { CoreModule } from 'src/core/core.module';
import { UniversityController } from './controllers/university.controller';
import { SecurityController } from './controllers/security.controller';
import { UsersController } from './controllers/users.controller';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    HealthController,
    SecurityController,
    UsersController,
    LanguagesController,
    UniversityController,
  ],
})
export class ApiModule {}
