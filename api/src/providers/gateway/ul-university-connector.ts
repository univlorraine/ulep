import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Env } from 'src/configuration';

@Injectable()
export class UlUniversityConnectorService {
  #connectorUrl?: string;
  #connectorToken?: string;

  constructor(
    private readonly httpService: HttpService,
    env: ConfigService<Env, true>,
  ) {
    this.#connectorUrl = env.get('CONNECTOR_URL');
    this.#connectorToken = env.get('CONNECTOR_TOKEN');
  }

  async getUserUniversityInfo(universityLogin: string): Promise<any> {
    const connectorUrl = this.#connectorUrl;
    const connectorToken = this.#connectorToken;

    if (!connectorUrl || !connectorToken) {
      return {};
    }

    if (!universityLogin) {
      throw new ForbiddenException();
    }

    const body = {
      login: universityLogin,
      clientUser: universityLogin,
    };
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${connectorToken}`,
      },
    };
    const res = await firstValueFrom(
      this.httpService.post(connectorUrl, body, requestConfig).pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
      ),
    );
    return res;
  }
}
