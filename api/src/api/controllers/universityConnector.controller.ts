import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { UlUniversityConnectorService } from '../../providers/gateway/ul-university-connector';
import * as Swagger from '@nestjs/swagger';
import { ConnectorResponse } from '../dtos/universityConnector';
import { CollectionResponse } from '../decorators';

export interface RetrieveUserUniversityInfoRequest {
  tokenKeycloak: string;
}

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
  async retrieveUserInfos(
    @Body() body: RetrieveUserUniversityInfoRequest,
  ): Promise<ConnectorResponse> {
    const token = body.tokenKeycloak;
    //TODO: faire un traitement du token keycloak, pour aller récupérer le loginUL
    const loginUL = 'champmar5';
    const resultFromService = await this.gatewayService.getUserUniversityInfo(
      loginUL,
    );
    return ConnectorResponse.fromDomain(resultFromService);
  }
}
