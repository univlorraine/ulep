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
import { RefusedTandem, Tandem } from 'src/core/models';
import { CHAT_SERVICE, ChatServicePort } from 'src/core/ports/chat.service';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  REFUSED_TANDEMS_REPOSITORY,
  RefusedTandemsRepository,
} from 'src/core/ports/refused-tandems.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

export type RefuseTandemCommand = {
  learningLanguageIds: string[];
  adminUniversityId?: string;
};

@Injectable()
export class RefuseTandemUsecase {
  private readonly logger = new Logger(RefuseTandemUsecase.name);

  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProvider,
    @Inject(REFUSED_TANDEMS_REPOSITORY)
    private readonly refusedTandemsRepository: RefusedTandemsRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
  ) {}

  async execute(command: RefuseTandemCommand): Promise<void> {
    const learningLanguages = await Promise.all(
      command.learningLanguageIds.map((id) =>
        this.tryToFindLearningLanguages(id),
      ),
    );
    const learningLanguageIds = learningLanguages.map((ll) => ll.id);

    const adminUniversityId =
      command.adminUniversityId ??
      (await this.universityRepository.findUniversityCentral()).id;

    const existingTandem =
      await this.tandemRepository.getTandemOfLearningLanguages(
        learningLanguageIds,
      );

    if (existingTandem) {
      this.logger.verbose(
        `Found tandem ${existingTandem.id} with status ${
          existingTandem.status
        } while refusing tandem for learningLanguages ${learningLanguageIds.join(
          ', ',
        )}`,
      );

      await this.tandemRepository.delete(existingTandem.id);
      this.sendTandemCancelledEmails(existingTandem);
      this.chatService.deleteConversation(existingTandem.id);
    }

    const refusedTandem = new RefusedTandem({
      id: this.uuidProvider.generate(),
      learningLanguageIds: learningLanguageIds,
      universityId: adminUniversityId,
    });

    await this.refusedTandemsRepository.save(refusedTandem);
  }

  private async tryToFindLearningLanguages(id: string) {
    const LearningLanguage = await this.learningLanguageRepository.ofId(id);
    if (!LearningLanguage) {
      throw new RessourceDoesNotExist();
    }

    return LearningLanguage;
  }

  private async sendTandemCancelledEmails(tandem: Tandem) {
    const universityIds = new Set<string>();
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
            `Error sending email to user ${profile.user.id} after tandem refused: ${error}`,
          );
        }
      }

      if (!universityIds.has(profile.user.university.id)) {
        if (profile.user.university.notificationEmail) {
          try {
            await this.emailGateway.sendTandemCanceledNoticeEmail({
              to: profile.user.university.notificationEmail,
              language: profile.user.university.country.code.toLowerCase(),
              user: {
                ...profile.user,
                university: profile.user.university.name,
              },
              partner: { ...partner, university: partner.university.name },
            });
          } catch (error) {
            this.logger.error(
              `Error sending email to university ${profile.user.university.id} after tandem refused: ${error}`,
            );
          }
        }
        universityIds.add(profile.user.university.id);
      }
    }
  }
}
