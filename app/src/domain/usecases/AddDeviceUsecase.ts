import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import AddDeviceUsecaseInterface from '../interfaces/AddDeviceUsecase.interface';

class AddDeviceUsecase implements AddDeviceUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(token: string, isAndroid: boolean, isIos: boolean): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.post(`/users/add-device`, {
                token,
                isAndroid,
                isIos,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AddDeviceUsecase;
