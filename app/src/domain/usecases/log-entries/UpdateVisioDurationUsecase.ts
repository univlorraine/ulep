import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import UpdateVisioDurationUsecaseInterface, {
    UpdateVisioDurationParams,
} from '../../interfaces/log-entries/UpdateVisioDurationUsecase.interface';

class UpdateVisioDurationUsecase implements UpdateVisioDurationUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(params: UpdateVisioDurationParams): Promise<void | Error> {
        try {
            const payload = {
                partnerTandemId: params.partnerTandemId,
                partnerFirstname: params.partnerFirstname,
                partnerLastname: params.partnerLastname,
            };

            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.put(
                `/learning-languages/${params.learningLanguageId}/update-visio-duration`,
                payload
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateVisioDurationUsecase;
