import { Controller, Post, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { configuration } from 'src/configuration';
import { Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';
import { archiveTandemsAndDeleteUsersUsecase } from 'src/core/usecases/purges/archive-tandems.usecase';
import { CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';

@Controller('purges')
@Swagger.ApiTags('Purges')
export class PurgesController {
  constructor(
    private readonly userTandemPurgeUsecase: archiveTandemsAndDeleteUsersUsecase,
  ) { }

  @Post()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create Purge ressource.' })
  async findAll(@CurrentUser() user: KeycloakUser) {
    const instance = await this.userTandemPurgeUsecase.execute({
      userId: user.sub,
    });
  }
}
