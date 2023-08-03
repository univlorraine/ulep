import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import AvatarCommand from '../../command/AvatarCommand';
import UpdateAvatarUsecaseInterface from '../interfaces/UpdateAvatarUsecase.interface';

class UpdateAvatarUsecase implements UpdateAvatarUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(avatar: File): Promise<string | Error> {
        try {
            const httpResponse: HttpResponse<AvatarCommand> = await this.domainHttpAdapter.post(
                `/uploads/image`,
                { avatar },
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.url;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateAvatarUsecase;
