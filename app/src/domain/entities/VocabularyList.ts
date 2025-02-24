import Language from './Language';
import Profile from './Profile';

class VocabularyList {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly symbol: string,
        public readonly editorsIds: string[],
        public readonly targetLanguage: Language,
        public readonly translationLanguage: Language,
        public readonly creatorId: string,
        public readonly creatorName: string,
        public readonly missingPronunciationOfWords: number,
        public readonly missingPronunciationOfTranslations: number,
        public numberOfVocabularies: number,
        public readonly isEditable: boolean
    ) {}

    public isMine(profile: Profile) {
        return this.creatorId === profile.id;
    }
}

export default VocabularyList;
