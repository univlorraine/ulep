import { KeycloakClient } from '@app/keycloak';
import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { configuration } from 'src/configuration';

@Injectable()
export class UlUniversityConnectorService {
  constructor(
    private readonly httpService: HttpService,
    private readonly keycloak: KeycloakClient,
  ) {}
  private urlConnecteur = configuration().connecteurUrl;
  private tokenConnecteur = configuration().connecteurToken;

  async getUserUniversityInfo(token: string): Promise<any> {
    if (!this.urlConnecteur || !this.tokenConnecteur) {
      return {};
    }

    const loginCentral = await this.keycloak.getUserLoginUl(token);

    if (!loginCentral) {
      throw new ForbiddenException();
    }

    const body = {
      login: loginCentral,
      clientUser: loginCentral,
    };
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.tokenConnecteur}`,
      },
    };
    const res = await firstValueFrom(
      this.httpService.post(this.urlConnecteur, body, requestConfig).pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
      ),
    );
    return res;
  }
}
