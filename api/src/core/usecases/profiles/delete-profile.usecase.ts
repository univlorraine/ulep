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

import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile, Tandem, TandemStatus, University } from 'src/core/models';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';

export class DeleteProfileCommand {
  id: string;
}

@Injectable()
export class DeleteProfileUsecase {
  private readonly logger = new Logger(DeleteProfileUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const profile = await this.profilesRepository.ofId(command.id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    await this.deleteTandems(profile);

    await this.profilesRepository.delete(profile);
  }

  private async deleteTandems(profile: Profile) {
    const tandems = await this.tandemRepository.getTandemsForProfile(
      profile.id,
    );

    if (tandems.length > 0) {
      for (const tandem of tandems) {
        await this.tandemRepository.delete(tandem.id);

        if (tandem.status === TandemStatus.ACTIVE) {
          await this.sendTandemCancelledEmail(tandem);
        }
      }
    }
  }

  async sendTandemCancelledEmail(tandem: Tandem) {
    const universities = new Set<University>();
    const profiles = tandem.learningLanguages.map(
      (language) => language.profile,
    );

    for (const profile of profiles) {
      const partner = profiles.find((p) => p.id !== profile.id).user;

      if (profile.user.acceptsEmail) {
        try {
          await this.emailGateway.sendTandemCanceledEmail({
            to: profile.user.email,
            language: profile.nativeLanguage.code,
            user: { ...profile.user, university: profile.user.university.name },
            partner: { ...partner, university: partner.university.name },
          });
        } catch (error) {
          this.logger.error(
            `Error sending email to user ${profile.user.id} after tandem cancel: ${error}`,
          );
        }
      }

      if (universities.has(profile.user.university)) {
        continue;
      }

      if (profile.user.university.notificationEmail) {
        try {
          await this.emailGateway.sendTandemCanceledNoticeEmail({
            to: profile.user.university.notificationEmail,
            language: profile.user.university.country.code.toLowerCase(),
            user: { ...profile.user, university: profile.user.university.name },
            partner: { ...partner, university: partner.university.name },
          });
        } catch (error) {
          this.logger.error(
            `Error sending email to university ${profile.user.university.id} after tandem cancel: ${error}`,
          );
        }
      }

      universities.add(profile.user.university);
    }
  }
}
