import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { firstValueFrom, map } from "rxjs";
import { IPersonne } from "./gateway.interface";
import { ConfigService } from "@nestjs/config";
import { configuration } from "src/configuration";

@Injectable()
export class GatewayService {
    constructor(
        private readonly httpService: HttpService
    ){}
    //INFOS: variables from the .env file (provided by the docker-compose)
    urlConnecteur = configuration().connecteurUrl;
    tokenConnecteur = configuration().connecteurToken;
    
    async retrieveUserInfosFromConnecteur(loginUL:string):Promise<IPersonne>{
        const body = {
            "login": loginUL,
            "clientUser": loginUL
        }
        const requestConfig: AxiosRequestConfig = {
            headers:{
                'Authorization': "Bearer "+this.tokenConnecteur,
                'content-type': "application/json",
            }
        }
        const responseConnecteur = await firstValueFrom(this.httpService.post(this.urlConnecteur,body,requestConfig).pipe(
            map((axiosResponse: AxiosResponse) => {
                return axiosResponse.data as IPersonne;
            })
        ))
        return responseConnecteur;
    }
}