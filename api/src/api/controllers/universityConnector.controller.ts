import { Controller, Header, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UlUniversityConnectorService } from '../../providers/gateway/ul-university-connector';
import * as Swagger from '@nestjs/swagger';
import { ConnectorResponse } from '../dtos/universityConnector';
import { CollectionResponse, CurrentUser } from '../decorators';
import { KeycloakUser } from '@app/keycloak';
import { AuthenticationGuard } from 'src/api/guards';

@Controller('userUniversityInfos')
@Swagger.ApiTags('userUniversityInfos')
export class UniversityConnectorController {
  constructor(private gatewayService: UlUniversityConnectorService) {}

  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  @Swagger.ApiOperation({
    summary: 'Retrieve informations of a user from his university.',
  })
  @Swagger.ApiResponse({ type: ConnectorResponse })
  @CollectionResponse(ConnectorResponse)
  @UseGuards(AuthenticationGuard)
  async retrieveUserInfos(
    @CurrentUser() user: KeycloakUser,
  ): Promise<ConnectorResponse> {
    const resultFromService = await this.gatewayService.getUserUniversityInfo(
      user.universityLogin,
    );
    return ConnectorResponse.fromDomain(resultFromService);
  }
}
