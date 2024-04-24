import { Collection } from '@app/common';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  Profile,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { HistorizedUnmatchedLearningLanguage } from 'src/core/models/historized-unmatched-learning-language';
import Purge from 'src/core/models/purge.model';
import {
  LearningLanguageRepository,
  LearningLanguageRepositoryGetProps,
} from 'src/core/ports/learning-language.repository';

export class InMemoryLearningLanguageRepository
  implements LearningLanguageRepository
{
  #learningLanguages: Map<string, LearningLanguage>;
  #tandemsPerLearningLanguages: Map<string, Tandem>;
  #historicUnmatchedLearningLanguages: Map<
    string,
    HistorizedUnmatchedLearningLanguage
  >;

  init(profiles: Profile[], existingTandems?: Tandem[]) {
    this.#learningLanguages = profiles.reduce((accumulator, profile) => {
      for (const ll of profile.learningLanguages) {
        accumulator.set(
          ll.id,
          new LearningLanguage({
            ...ll,
            profile: profile,
          }),
        );
      }
      return accumulator;
    }, new Map<string, LearningLanguage>());

    if (existingTandems) {
      this.#tandemsPerLearningLanguages = existingTandems.reduce(
        (accumulator, tandem) => {
          for (const ll of tandem.learningLanguages) {
            if (accumulator.has(ll.id)) {
              throw new Error('2 tandems on same learning language');
            } else {
              accumulator.set(ll.id, tandem);
            }
          }
          return accumulator;
        },
        new Map<string, Tandem>(),
      );
    }
  }

  reset(): void {
    this.#learningLanguages = new Map();
    this.#tandemsPerLearningLanguages = new Map();
  }

  ofId(id: string): Promise<LearningLanguage | null> {
    return Promise.resolve(this.#learningLanguages.get(id));
  }

  async ofProfile(id: string): Promise<LearningLanguage[]> {
    return Array.from(this.#learningLanguages.values()).filter(
      (language: LearningLanguage) => language.profile.id === id,
    );
  }

  create(learningLanguage: LearningLanguage): Promise<void> {
    this.#learningLanguages.set(learningLanguage.id, learningLanguage);
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.#learningLanguages.delete(id);
    return Promise.resolve();
  }

  update(learningLanguage: LearningLanguage): Promise<void> {
    this.#learningLanguages.set(learningLanguage.id, learningLanguage);
    return Promise.resolve();
  }

  getLearningLanguagesOfProfileSpeakingAndNotInActiveTandemFromUniversities(
    languageId: string,
    universityIds: string[],
  ): Promise<LearningLanguage[]> {
    const res = [];

    for (const learningLanguage of this.#learningLanguages.values()) {
      if (
        learningLanguage.profile?.spokenLanguages.some(
          (language) => language.id === languageId,
        )
      ) {
        if (
          universityIds.includes(learningLanguage.profile.user.university.id)
        ) {
          if (
            !this.#tandemsPerLearningLanguages?.has(learningLanguage.id) ||
            this.#tandemsPerLearningLanguages?.get(learningLanguage.id)
              .status !== TandemStatus.ACTIVE
          ) {
            res.push(learningLanguage);
          }
        }
      }
    }

    return Promise.resolve(res);
  }

  getAvailableLearningLanguagesOfUniversities(universityIds: string[]) {
    const res = [];

    for (const learningLanguage of this.#learningLanguages.values()) {
      if (
        universityIds.includes(learningLanguage.profile?.user.university.id)
      ) {
        if (
          !this.#tandemsPerLearningLanguages?.has(learningLanguage.id) ||
          this.#tandemsPerLearningLanguages?.get(learningLanguage.id).status !==
            TandemStatus.ACTIVE
        ) {
          res.push(learningLanguage);
        }
      }
    }

    return Promise.resolve(res);
  }

  hasAnActiveTandem(id: string): Promise<boolean> {
    if (
      this.#tandemsPerLearningLanguages?.get(id)?.status === TandemStatus.ACTIVE
    ) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  getAvailableLearningLanguagesSpeakingOneOfLanguagesAndFromUniversities(
    allowedLanguageIds: string[],
    universityIds: string[],
  ): Promise<LearningLanguage[]> {
    return Promise.resolve(
      [...this.#learningLanguages.values()].filter(
        (learningLanguage) =>
          universityIds.includes(learningLanguage.profile.user.university.id) &&
          learningLanguage.profile.spokenLanguages.some((masteredLanguage) =>
            allowedLanguageIds.includes(masteredLanguage.id),
          ) &&
          (!this.#tandemsPerLearningLanguages?.has(learningLanguage.id) ||
            this.#tandemsPerLearningLanguages?.get(learningLanguage.id)
              .status !== TandemStatus.ACTIVE),
      ),
    );
  }

  getAvailableLearningLanguagesSpeakingLanguageFromUniversities(
    languageId: string,
    universityIds: string[],
  ): Promise<LearningLanguage[]> {
    return Promise.resolve(
      [...this.#learningLanguages.values()].filter(
        (learningLanguage) =>
          universityIds.includes(learningLanguage.profile.user.university.id) &&
          learningLanguage.profile.spokenLanguages.some(
            (masteredLanguage) => masteredLanguage.id === languageId,
          ) &&
          (!this.#tandemsPerLearningLanguages?.has(learningLanguage.id) ||
            this.#tandemsPerLearningLanguages?.get(learningLanguage.id)
              .status !== TandemStatus.ACTIVE),
      ),
    );
  }

  OfUniversities({
    limit,
    page,
    universityIds,
  }: LearningLanguageRepositoryGetProps): Promise<
    Collection<LearningLanguageWithTandem>
  > {
    const values = Array.from(this.#learningLanguages.values()).filter((ll) =>
      universityIds.includes(ll.profile.user.university.id),
    );

    let items = values.map((item) => {
      const tandem = this.#tandemsPerLearningLanguages.get(item.id);
      return { ...item, tandem };
    });
    if (limit && page) {
      const firstItem = (page - 1) * limit;
      items = values.slice(firstItem, firstItem + limit).map((item) => {
        const tandem = this.#tandemsPerLearningLanguages.get(item.id);
        return { ...item, tandem };
      });
    }

    return Promise.resolve(
      new Collection<LearningLanguageWithTandem>({
        items: items.map((item) => new LearningLanguageWithTandem(item)),
        totalItems: values.length,
      }),
    );
  }

  getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedUnmatchedLearningLanguage> {
    return Promise.resolve(
      Array.from(this.#historicUnmatchedLearningLanguages.values()).find(
        (historizedUnmatchedLearningLanguage) =>
          historizedUnmatchedLearningLanguage.userId === userId &&
          historizedUnmatchedLearningLanguage.language.id === languageId,
      ),
    );
  }

  getUnmatchedLearningLanguages(): Promise<LearningLanguage[]> {
    return Promise.resolve(
      Array.from(this.#learningLanguages.values()).filter(
        (learningLanguage) => !learningLanguage.tandemLanguage,
      ),
    );
  }

  archiveUnmatchedLearningLanguages(
    learningLanguages: LearningLanguage[],
    purgeId: string,
  ): Promise<void> {
    learningLanguages.forEach((learningLanguage) => {
      const purge = new Purge({
        id: purgeId,
        createdAt: new Date(),
      });
      this.#learningLanguages.set(learningLanguage.id, undefined);
      this.#historicUnmatchedLearningLanguages.set(
        learningLanguage.id,
        new HistorizedUnmatchedLearningLanguage({
          id: learningLanguage.id,
          userId: learningLanguage.profile.user.id,
          purge,
          createdAt: new Date(),
          language: learningLanguage.language,
        }),
      );
    });

    return Promise.resolve();
  }
}
