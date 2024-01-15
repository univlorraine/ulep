import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import MediaObjectCommand from '../../command/MediaObjectCommand';
import MediaObject from '../entities/MediaObject';
import UpdateAvatarUsecaseInterface from '../interfaces/UpdateAvatarUsecase.interface';

class UpdateAvatarUsecase implements UpdateAvatarUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) { }

    async execute(avatar: File): Promise<MediaObject | Error> {
        try {
            const httpResponse: HttpResponse<MediaObjectCommand & { url: string }> = await this.domainHttpAdapter.post(
                `/uploads/avatar`,
                { file: avatar },
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateAvatarUsecase;
