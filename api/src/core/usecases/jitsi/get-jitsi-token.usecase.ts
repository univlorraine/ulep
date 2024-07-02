import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { GetUserUsecase } from '../user/get-user.usecase';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import * as jwt from 'jsonwebtoken';

const sign = (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  avatar: string,
  allowedRoom: string,
  keycloakClientSecret: string,
) => {
  const now = Math.floor(new Date().getTime() / 1000);
  return jwt.sign(
    {
      context: {
        user: {
          id,
          name: firstName + ' ' + lastName,
          email: email,
          avatar: avatar,
        },
      },
      nbf: now,
      aud: 'jitsi',
      iss: 'api',
      sub: '*',
      exp: now + 60 * 60 * 24, // 24 hours
      room: allowedRoom,
    },
    keycloakClientSecret,
  );
};

@Injectable()
export class GetJitsiTokenUsecase {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    private readonly env: ConfigService<Env, true>,
  ) {}

  async execute(user: KeycloakUser): Promise<string> {
    const id = user.sub;
    const me = await this.getUserUsecase.execute(id);

    const avatarSignedUrl = me.avatar
      ? await this.storage.temporaryUrl(
          me.avatar.bucket,
          me.avatar.name,
          this.env.get('SIGNED_URL_EXPIRATION_IN_SECONDS'),
        )
      : undefined;

    return sign(
      id,
      me.firstname,
      me.lastname,
      me.email,
      avatarSignedUrl,
      '*', // TODO: add a list allowed room name
      this.env.get('KEYCLOAK_CLIENT_SECRET'),
    );
  }
}
