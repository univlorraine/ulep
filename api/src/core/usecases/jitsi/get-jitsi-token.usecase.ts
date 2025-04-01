/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
