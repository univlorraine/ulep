import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { firstValueFrom, map } from "rxjs";
import { configuration } from "src/configuration";

@Injectable()
export class GatewayService {
    constructor(
        private readonly httpService: HttpService
    ){}
    private urlConnecteur = configuration().connecteurUrl;
    private tokenConnecteur = configuration().connecteurToken;
    
    async getUserUniversityInfo(loginUL:string):Promise<any>{
        const body = {
            "login": loginUL,
            "clientUser": loginUL
        }
        const requestConfig: AxiosRequestConfig = {
            headers:{
                'Authorization': `Bearer ${this.tokenConnecteur}`,
            }
        }
        const res = await firstValueFrom(this.httpService.post(this.urlConnecteur,body,requestConfig).pipe(
            map((axiosResponse: AxiosResponse) => {
                return axiosResponse.data;
            })
        ))
        return res;
    }
}