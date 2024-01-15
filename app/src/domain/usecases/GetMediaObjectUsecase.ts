import { HttpResponse } from "../../adapter/BaseHttpAdapter";
import { HttpAdapterInterface } from "../../adapter/DomainHttpAdapter";
import MediaObjectCommand, { mediaObjectCommandToDomain } from "../../command/MediaObjectCommand";
import MediaObject from "../entities/MediaObject";
import GetMediaObjectUsecaseInterface from "../interfaces/GetMediaObjectUsecase.interface";

class GetMediaObjectUsecase implements GetMediaObjectUsecaseInterface {
  constructor(private readonly domainHttpAdapter: HttpAdapterInterface) { }

  async execute(id: string, accessToken: string): Promise<(MediaObject & { url: string; }) | Error> {
    try {
      const httpResponse: HttpResponse<MediaObjectCommand & { url: string }> = await this.domainHttpAdapter.get(
        `/uploads/${id}`,
        {},
        false,
        accessToken
      );

      if (!httpResponse.parsedBody) {
        return new Error('errors.global');
      }

      return {
        ...mediaObjectCommandToDomain(httpResponse.parsedBody),
        url: httpResponse.parsedBody.url
      };
    } catch (error: any) {
      return new Error('errors.global');
    }
  }
}

export default GetMediaObjectUsecase;