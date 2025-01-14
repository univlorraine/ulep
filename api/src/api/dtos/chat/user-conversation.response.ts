import { UserRepresentation } from '@app/keycloak';
import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaObjectResponse } from 'src/api/dtos/medias';
import { User } from 'src/core/models';

export class UserChatResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'email' })
  @Expose({ groups: ['read'] })
  email: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  firstname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  lastname: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  isAdministrator: boolean;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  avatar?: MediaObjectResponse;

  constructor(partial: Partial<UserChatResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(user: User | UserRepresentation): UserChatResponse {
    if (user instanceof User) {
      return new UserChatResponse({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdministrator: false,
        avatar: user.avatar
          ? MediaObjectResponse.fromMediaObject(user.avatar)
          : null,
      });
    } else {
      return new UserChatResponse({
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        isAdministrator: true,
        avatar: null,
      });
    }
  }
}
