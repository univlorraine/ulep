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
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus, User } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import { TANDEM_REPOSITORY } from 'src/core/ports/tandem.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { ChatService } from 'src/providers/services/chat.service';
import { TandemRepository } from '../../ports/tandem.repository';

interface ValidateTandemCommand {
  id: string;
  adminUniversityId?: string;
}

@Injectable()
export class ValidateTandemUsecase {
  private readonly logger = new Logger(ValidateTandemUsecase.name);

  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
  ) {}

  async execute(command: ValidateTandemCommand): Promise<void> {
    const tandem = await this.tandemRepository.ofId(command.id);
    if (!tandem) {
      throw new RessourceDoesNotExist();
    }

    if (tandem.status !== TandemStatus.VALIDATED_BY_ONE_UNIVERSITY) {
      throw new DomainError({
        message: `Tandem with status ${tandem.status} can't be validated: ${command.id}`,
      });
    }

    const adminUniversityId =
      command.adminUniversityId ??
      (await this.universityRepository.findUniversityCentral()).id;

    const learningLanguagesFromAdminUniversity =
      tandem.learningLanguages.filter(
        (ll) => ll.profile.user.university.id === adminUniversityId,
      );

    let updatedTandem: Tandem;
    if (learningLanguagesFromAdminUniversity.length === 0) {
      throw new DomainError({
        message: 'No concerned learning languages is from admin university',
      });
    } else if (tandem.universityValidations.includes(adminUniversityId)) {
      throw new DomainError({
        message: 'Admin university has already validated this tandem',
      });
    } else {
      updatedTandem = new Tandem({
        ...tandem,
        status: TandemStatus.ACTIVE,
        universityValidations: [
          ...tandem.universityValidations,
          adminUniversityId,
        ],
      });
    }

    await this.tandemRepository.update(updatedTandem);

    if (updatedTandem.status === TandemStatus.ACTIVE) {
      await this.createConversation(updatedTandem);
    }

    if (updatedTandem.status === TandemStatus.ACTIVE) {
      const [learningLanguage1, learningLanguage2] = tandem.learningLanguages;
      if (learningLanguage1.profile.user.acceptsEmail) {
        await this.sendTamdemValidatedEmail({
          language: learningLanguage1.profile.nativeLanguage.code,
          user: learningLanguage1.profile.user,
          partner: learningLanguage2.profile.user,
        });
      }

      if (learningLanguage2.profile.user.acceptsEmail) {
        await this.sendTamdemValidatedEmail({
          language: learningLanguage2.profile.nativeLanguage.code,
          user: learningLanguage2.profile.user,
          partner: learningLanguage1.profile.user,
        });
      }
    }
  }

  private async createConversation(tandem: Tandem): Promise<void> {
    const participantIds = [
      tandem.learningLanguages[0].profile.user.id,
      tandem.learningLanguages[1].profile.user.id,
    ];

    await this.chatService.createConversation(participantIds, tandem.id, {});
  }

  private async sendTamdemValidatedEmail(props: {
    language: string;
    user: User;
    partner: User;
  }): Promise<void> {
    try {
      await this.emailGateway.sendNewPartnerEmail({
        to: props.user.email,
        language: props.language,
        user: {
          ...props.user,
          university: props.user.university.name,
        },
        partner: {
          ...props.partner,
          university: props.partner.university.name,
        },
      });
    } catch (error) {
      this.logger.error('Error while sending tandem validated email', error);
    }
  }
}
