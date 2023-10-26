import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { RefusedTandem, TandemStatus } from 'src/core/models';
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
} from 'src/core/ports/tandems.repository';
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
        } while refusing tandem for learningLanuguages ${learningLanguageIds.join(
          ', ',
        )}`,
      );
      if (existingTandem.status === TandemStatus.INACTIVE) {
        throw new DomainError({
          message: `University ${adminUniversityId} Can't refuse inactive tandem ${existingTandem.id}`,
        });
      }

      this.tandemRepository.delete(existingTandem.id);
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
}
