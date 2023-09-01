import { cp } from 'fs';
import {
  LearningLanguage,
  Profile,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { LearningLanguageRepository } from 'src/core/ports/learning-language.repository';

export class InMemoryLearningLanguageRepository
  implements LearningLanguageRepository
{
  #learningLanguages: Map<string, LearningLanguage>;
  #tandemsPerLearningLanguages: Map<string, Tandem>;

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

  getLearningLanguagesOfProfileSpeakingAndNotInActiveTandem(
    languageId: string,
  ): Promise<LearningLanguage[]> {
    const res = [];

    for (const learningLanguage of this.#learningLanguages.values()) {
      if (
        learningLanguage.profile?.masteredLanguages.some(
          (language) => language.id === languageId,
        ) ||
        learningLanguage.profile?.nativeLanguage.id === languageId
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

  getLearningLanguagesOfUniversitiesNotInActiveTandem(universityIds: string[]) {
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
}
