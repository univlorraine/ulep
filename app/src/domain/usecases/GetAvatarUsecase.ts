import { HttpResponse } from "../../adapter/BaseHttpAdapter";
import { HttpAdapterInterface } from "../../adapter/DomainHttpAdapter";
import AvatarCommand, { avatarCommandToDomain } from "../../command/AvatarCommand";
import MediaObject from "../entities/MediaObject";

class GetAvatarUsecase {
  constructor(private readonly domainHttpAdapter: HttpAdapterInterface) { }

  async execute(id: string, accessToken: string): Promise<MediaObject | Error> {
    try {
      const httpResponse: HttpResponse<AvatarCommand> = await this.domainHttpAdapter.get(
        `/uploads/${id}`,
        {},
        false,
        accessToken
      );

      if (!httpResponse.parsedBody) {
        return new Error('errors.global');
      }
      return avatarCommandToDomain(httpResponse.parsedBody);
    } catch (error: any) {
      return new Error('errors.global');
    }
  }
}

export default GetAvatarUsecase;