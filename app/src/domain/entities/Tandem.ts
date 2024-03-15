import LearningLanguage from './LearningLanguage';
import Profile from './Profile';

class Tandem {
    constructor(
        public id: string,
        public status: TandemStatus,
        public learningLanguage: LearningLanguage,
        public partnerLearningLanguage: LearningLanguage,
        public level: CEFR,
        public pedagogy: Pedagogy,
        public partner?: Profile
    ) {}
}

export default Tandem;
