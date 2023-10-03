import { Body, Controller, Header, HttpCode, Post } from "@nestjs/common";
import { GatewayService } from "../../providers/gateway/gateway.service";
import * as Swagger from '@nestjs/swagger';
import { ConnecteurResponse } from "../dtos/connecteur";
import { CollectionResponse } from "../decorators";

export interface RetrieveUserUniversityInfoRequest {
    tokenKeycloak: string;
}

@Controller('UserUniversityInfos')
@Swagger.ApiTags('UserUniversityInfos')
export class GatewayController {

    constructor(
        private gatewayService: GatewayService,
    ){}

    @Post()
    @HttpCode(200)
    @Header('Content-Type','application/json')
    @Swagger.ApiOperation({ summary: 'Retrieve informations of a user from his university.' })
    @Swagger.ApiResponse({ type: ConnecteurResponse })
    @CollectionResponse(ConnecteurResponse)
    async retrieveUserInfos(@Body() body: RetrieveUserUniversityInfoRequest) : Promise<ConnecteurResponse> {
        const token = body.tokenKeycloak;
        //TODO: faire un traitement du token keycloak, pour aller récupérer le loginUL
        const loginUL = "champmar5";
        const resultFromService = await this.gatewayService.getUserUniversityInfo(loginUL);
        return ConnecteurResponse.fromDomain(resultFromService);
    }
}