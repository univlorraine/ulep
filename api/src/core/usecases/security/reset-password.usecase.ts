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

import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';

export class ResetPasswordCommand {
  email: string;
  loginUrl: string;
}

@Injectable()
export class ResetPasswordUsecase {
  private readonly logger = new Logger(ResetPasswordUsecase.name);

  constructor(
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly keycloakClient: KeycloakClient,
    private readonly env: ConfigService<Env, true>,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const user = await this.keycloakClient.getUserByEmail(command.email);

    if (!user) {
      return;
    }

    const userIsAdmin = await this.keycloakClient.isAdmin(user);
    if (userIsAdmin) {
      return;
    }

    const credentials = await this.keycloakClient.getUserCredentials(user.id);

    const hasPasswordCredentials = credentials.some(
      (credential) => credential.type === 'password',
    );

    const language = await this.getUserLanguage(user.id);

    if (hasPasswordCredentials) {
      await this.sendResetPasswordEmail(user, command.loginUrl, language);
    } else {
      await this.sendPasswordChangeDeniedEmail(user, language);
    }
  }

  private async sendResetPasswordEmail(
    user: UserRepresentation,
    loginUrl: string,
    language: string,
  ): Promise<void> {
    try {
      await this.keycloakClient.executeActionEmail(
        ['UPDATE_PASSWORD'],
        user.id,
        language,
        loginUrl,
      );
    } catch (error) {
      this.logger.error('Error while sending ResetPasswordEmail', error);
    }
  }

  private async sendPasswordChangeDeniedEmail(
    user: UserRepresentation,
    language: string,
  ): Promise<void> {
    try {
      await this.emailGateway.sendPasswordChangeDeniedEmail({
        to: user.email,
        language,
        user: {
          firstname: user.firstName,
          lastname: user.lastName,
        },
      });
    } catch (error) {
      this.logger.error('Error while sending PasswordChangeDeniedEmail', error);
    }
  }

  private async getUserLanguage(user: string): Promise<string> {
    const profile = await this.profileRepository.ofUser(user);

    const language = profile
      ? profile.nativeLanguage.code
      : this.env.get('DEFAULT_TRANSLATION_LANGUAGE');

    return language;
  }
}
