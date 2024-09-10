import Language from './Language';

class VocabularyList {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly symbol: string,
        public readonly editorsIds: string[],
        public readonly wordLanguage: Language,
        public readonly translationLanguage: Language,
        public readonly creatorId: string,
        public readonly creatorName: string,
        public readonly missingPronunciationOfWords: number,
        public readonly missingPronunciationOfTranslations: number,
        public readonly numberOfVocabularies: number
    ) {}
}

export default VocabularyList;
