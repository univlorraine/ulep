import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { UlUniversityConnectorService } from '../../providers/gateway/ul-university-connector';
import * as Swagger from '@nestjs/swagger';
import { ConnectorResponse } from '../dtos/universityConnector';
import { CollectionResponse, CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';
import { AuthenticationGuard } from 'src/api/guards';

@Controller('userUniversityInfos')
@Swagger.ApiTags('userUniversityInfos')
export class UniversityConnectorController {
  private readonly logger = new Logger(UniversityConnectorController.name);

  constructor(private gatewayService: UlUniversityConnectorService) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve informations of a user from his university.',
  })
  @Swagger.ApiResponse({ type: ConnectorResponse })
  @CollectionResponse(ConnectorResponse)
  @UseGuards(AuthenticationGuard)
  async retrieveUserInfos(
    @CurrentUser() user: KeycloakUser,
  ): Promise<ConnectorResponse> {
    try {
      const resultFromService = await this.gatewayService.getUserUniversityInfo(
        user.universityLogin,
      );
      return ConnectorResponse.fromDomain(resultFromService);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
