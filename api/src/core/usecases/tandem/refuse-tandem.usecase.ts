import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { RefusedTandem, Tandem, TandemStatus } from 'src/core/models';
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
import { CHAT_SERVICE, ChatServicePort } from 'src/core/ports/chat.service';

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
      if (existingTandem.status === TandemStatus.INACTIVE) {
        throw new DomainError({
          message: `University ${adminUniversityId} Can't refuse inactive tandem ${existingTandem.id}`,
        });
      }

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
