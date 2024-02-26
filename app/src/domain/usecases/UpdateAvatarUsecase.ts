import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import MediaObjectCommand from '../../command/MediaObjectCommand';
import MediaObject from '../entities/MediaObject';
import UpdateAvatarUsecaseInterface from '../interfaces/UpdateAvatarUsecase.interface';

const regexValidationErrorFileSizeExceed = /expected size is less than (\d+)/

export const UPDATE_AVATAR_MAX_SIZE_ERROR = "FILE_MAX_SIZE";
export interface AvatarMaxSizeCause {
    type: string;
    maxSize: number;
}

export class AvatarMaxSizeError extends Error {
    public maxSize: number;

    constructor(message: string, maxSize: number, options?: ErrorOptions) {
      super(message, options);
      this.maxSize = maxSize;
  
      // Set the prototype explicitly.
      Object.setPrototypeOf(this, AvatarMaxSizeError.prototype);
    }
  }
  
  

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
            if (error.error?.statusCode === 400) {
                const fileSizeExceedProcessedError =  error.error.message.match(regexValidationErrorFileSizeExceed);
                if (fileSizeExceedProcessedError && fileSizeExceedProcessedError.length === 2) {
                    return new AvatarMaxSizeError("errors.fileSizeExceed", fileSizeExceedProcessedError[1] / 1000000);
                }
            }
            return new Error('errors.global');
        }
    }
}

export default UpdateAvatarUsecase;
