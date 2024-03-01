import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import TandemCommand, { tandemCommandToDomain } from '../../command/TandemCommand';
import Tandem from '../entities/Tandem';
import GetAllTandemsUsecaseInterface from '../interfaces/GetAllTandemsUsecase.interface';

class GetAllTandemsUsecase implements GetAllTandemsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Tandem[] | Error> {
        try {
            const httpResponse: HttpResponse<TandemCommand[]> = await this.domainHttpAdapter.get(
                `/profiles/${id}/tandems`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return tandemCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllTandemsUsecase;
