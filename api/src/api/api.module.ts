import { Module } from '@nestjs/common';
import { LanguagesController } from './controllers/languages.controller';
import { CoreModule } from 'src/core/core.module';
import { OrganizationController } from './controllers/organisations.controller';
import { SecurityController } from './controllers/security.controller';
import { UsersController } from './controllers/users.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [CoreModule],
  controllers: [
    HealthController,
    SecurityController,
    UsersController,
    LanguagesController,
    OrganizationController,
  ],
})
export class ApiModule {}
