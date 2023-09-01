import { LearningLanguage, Tandem, TandemStatus } from 'src/core/models';
import { LearningLanguageRepository } from 'src/core/ports/learning-language.repository';

interface LearningLanguageWithTandems extends LearningLanguage {
  tandems: Tandem[];
}

export class InMemoryLearningLanguageRepository
  implements LearningLanguageRepository
{
  #learningLanguages: Map<string, LearningLanguageWithTandems>;

  constructor(learningLanguages: LearningLanguageWithTandems[]) {
    this.#learningLanguages = new Map<string, LearningLanguageWithTandems>(
      learningLanguages.map((learningLanguage) => [
        learningLanguage.id,
        learningLanguage,
      ]),
    );
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
        (learningLanguage.profile?.masteredLanguages.some(
          (language) => language.id === languageId,
        ) ||
          learningLanguage.profile?.nativeLanguage.id === languageId) &&
        !learningLanguage.tandems.some(
          (tandem) => tandem.status === TandemStatus.ACTIVE,
        )
      ) {
        res.push(learningLanguage);
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
        res.push(learningLanguage);
      }
    }

    return Promise.resolve(res);
  }

  hasAnActiveTandem(id: string): Promise<boolean> {
    const item = this.#learningLanguages.get(id);
    if (!item) {
      return Promise.resolve(false);
    }

    if (item.tandems.some((tandem) => tandem.status === TandemStatus.ACTIVE)) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }
}
