import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { configuration } from 'src/configuration';

@Injectable()
export class UlUniversityConnectorService {
  constructor(private readonly httpService: HttpService) {}
  private config = configuration();

  async getUserUniversityInfo(universityLogin: string): Promise<any> {
    const connectorUrl = this.config.connectorUrl;
    const connectorToken = this.config.connectorToken;
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
