import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguageIsAlreadyInActiveTandemError } from 'src/core/errors/tandem-exceptions';
import { LearningLanguage, Tandem, TandemStatus } from 'src/core/models';
import {
  LEARNING_LANGUAGE_REPOSITORY,
  LearningLanguageRepository,
} from 'src/core/ports/learning-language.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

export type CreateTandemCommand = {
  learningLanguages: string[];
  status: TandemStatus;
};

@Injectable()
export class CreateTandemUsecase {
  private readonly logger = new Logger(CreateTandemUsecase.name);

  constructor(
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProvider,
  ) {}

  async execute(command: CreateTandemCommand): Promise<Tandem> {
    const learningLanguages = await Promise.all(
      command.learningLanguages.map((id) =>
        this.tryToFindLearningLanguages(id),
      ),
    );

    await Promise.all(
      learningLanguages.map(
        (ll) => this.assertLearningLanguageIsNotInActiveTandem(ll),
        // TODO(NOW+1): Will cause error in single/global routine cohabitation. Maybe we should
        // Remove other Draft tandems concerning profile.
      ),
    );

    const tandem = Tandem.create({
      id: this.uuidProvider.generate(),
      learningLanguages,
      status: command.status,
    });

    await this.tandemsRepository.save(tandem);

    return tandem;
  }

  private async tryToFindLearningLanguages(id: string) {
    const LearningLanguage = await this.learningLanguageRepository.ofId(id);
    if (!LearningLanguage) {
      throw new RessourceDoesNotExist();
    }

    return LearningLanguage;
  }

  private async assertLearningLanguageIsNotInActiveTandem(
    learningLanguage: LearningLanguage,
  ): Promise<void> {
    const hasActiveTandem =
      await this.learningLanguageRepository.hasAnActiveTandem(
        learningLanguage.id,
      );

    if (hasActiveTandem) {
      throw new LearningLanguageIsAlreadyInActiveTandemError(
        learningLanguage.id,
      );
    }
  }
}
