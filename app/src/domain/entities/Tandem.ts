import Language from './Language';
import Profile from './Profile';

class Tandem {
    constructor(
        public id: string,
        public status: TandemStatus,
        public learningLanguage: Language,
        public level: CEFR,
        public partner?: Profile
    ) {}
}

export default Tandem;
