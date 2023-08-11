import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ResetPasswordUsecaseInterface from '../interfaces/ResetPasswordUsecase.interface';

class ResetPasswordUsecase implements ResetPasswordUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, password: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<any> = await this.domainHttpAdapter.put(
                `/users/${id}/reset-password`,
                {
                    password,
                },
                {},
                false
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default ResetPasswordUsecase;
