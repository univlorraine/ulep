import Language from './Language';
import Profile from './Profile';

class VocabularyList {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly symbol: string,
        public readonly profiles: Profile[],
        public readonly wordLanguage: Language,
        public readonly translationLanguage: Language
    ) {}
}

export default VocabularyList;
