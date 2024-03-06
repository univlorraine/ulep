import {
  Controller,
  Get,
  Header,
  HttpCode,
  UseGuards,
  Logger,
} from '@nestjs/common';
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

  @Get()
  // @HttpCode(200)
  // @Header('Content-Type', 'application/json')
  @Swagger.ApiOperation({
    summary: 'Retrieve informations of a user from his university.',
  })
  @Swagger.ApiResponse({ type: ConnectorResponse })
  @CollectionResponse(ConnectorResponse)
  @UseGuards(AuthenticationGuard)
  async retrieveUserInfos(
    @CurrentUser() user: KeycloakUser,
  ): Promise<ConnectorResponse> {
    console.info('get /users/infos');
    try {
      const resultFromService = await this.gatewayService.getUserUniversityInfo(
        user.universityLogin,
      );
      console.info('resultFromService', resultFromService);
      return ConnectorResponse.fromDomain(resultFromService);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
