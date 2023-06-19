import { Module } from '@nestjs/common';
import { LanguagesController } from './controllers/languages.controller';
import { CoreModule } from 'src/core/core.module';
import { UniversityController } from './controllers/university.controller';
import { SecurityController } from './controllers/security.controller';
import { UsersController } from './controllers/users.controller';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CountriesController } from 'src/api/controllers/countries.controller';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [
    CountriesController,
    HealthController,
    SecurityController,
    UsersController,
    LanguagesController,
    UniversityController,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class ApiModule {}
