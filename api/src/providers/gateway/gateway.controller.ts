import { Body, Controller, Header, HttpCode, Post } from "@nestjs/common";
import { GatewayService } from "./gateway.service";

export interface bodyConnecteur {
    "login": string
}

@Controller('connecteur')
export class GatewayController {

    constructor(
        private gatewayService: GatewayService,
    ){}

    //TODO: Ajouter la doc swagger
    //TODO: Penser à trouver comment faire passer les codes d'erreurs du connecteur directement (principalement pour le "person not found")
    @Post()
    @HttpCode(200)
    @Header('Content-Type','application/json')
    async retrieveUserInfos(@Body() body: bodyConnecteur) {
        const resultFromService = await this.gatewayService.retrieveUserInfosFromConnecteur(body.login);
        return JSON.stringify(resultFromService);
    }
}