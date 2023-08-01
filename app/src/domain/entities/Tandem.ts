import Language from './Language';
import Profile from './Profile';

class Tandem {
    constructor(
        public id: string,
        public profiles: Profile[],
        public language: Language,
        public status: TandemStatus
    ) {}
}

export default Tandem;
