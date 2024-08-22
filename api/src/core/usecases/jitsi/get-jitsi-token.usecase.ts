import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Env } from 'src/configuration';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import { GetMediaObjectUsecase } from '../media';

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
    private readonly getMediaObjectUsecase: GetMediaObjectUsecase,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    private readonly env: ConfigService<Env, true>,
  ) {}

  async execute(user: KeycloakUser): Promise<string> {
    const id = user.sub;
    const instance = await this.getMediaObjectUsecase.execute({ id });
    const avatarSignedUrl = instance
      ? await this.storage.temporaryUrl(
          instance.bucket,
          instance.name,
          this.env.get('SIGNED_URL_EXPIRATION_IN_SECONDS'),
        )
      : undefined;

    return sign(
      id,
      user.given_name,
      user.family_name,
      user.email,
      avatarSignedUrl,
      '*', // TODO: add a list allowed room name
      this.env.get('KEYCLOAK_CLIENT_SECRET'),
    );
  }
}
