import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import GetJitsiTokenUsecaseInterface from '../interfaces/GetJitsiTokenUsecase.interface';

class GetJitsiTokenUsecase implements GetJitsiTokenUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(accessToken: string): Promise<{ token: string } | Error> {
        try {
            const httpResponse: HttpResponse<{ token: string }> = await this.domainHttpAdapter.get(
                `/authentication/jitsi/token`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return { token: httpResponse.parsedBody.token };
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetJitsiTokenUsecase;
