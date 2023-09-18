import { Interest } from './CategoryInterests';
import Goal from './Goal';
import Language from './Language';
import User from './User';

class Profile {
    constructor(
        public readonly id: string,
        public readonly nativeLanguageCode: string,
        public readonly learningLanguage: Language[],
        public readonly goals: Goal[],
        public readonly frequency: MeetFrequency,
        public readonly interests: Interest[],
        public readonly biography: { anecdote: string; experience: string; favoritePlace: string; superpower: string },
        public user: User
    ) {}
}

export default Profile;
