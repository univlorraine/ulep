import { Interest } from './CategoryInterests';
import Goal from './Goal';
import Language from './Language';
import LearningLanguage from './LearningLanguage';
import { Availabilites } from './ProfileSignUp';
import TestedLanguage from './TestedLanguage';
import User from './User';

class Profile {
    constructor(
        public readonly id: string,
        public readonly nativeLanguage: Language,
        public readonly masteredLanguages: Language[],
        public readonly testedLanguages: TestedLanguage[],
        public learningLanguages: LearningLanguage[],
        public readonly goals: Goal[],
        public readonly frequency: MeetFrequency,
        public readonly interests: Interest[],
        public readonly biography: { anecdote: string; experience: string; favoritePlace: string; superpower: string },
        public readonly availabilities: Availabilites,
        public user: User,
        public readonly availabilitiesNote?: string,
        public readonly availabilitiesNotePrivacy?: boolean
    ) {}
}

export default Profile;
