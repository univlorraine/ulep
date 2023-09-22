import { Interest } from './CategoryInterests';
import Goal from './Goal';
import Language from './Language';
import { Availabilites } from './ProfileSignUp';
import User from './User';

class Profile {
    constructor(
        public readonly id: string,
        public readonly nativeLanguage: Language,
        public readonly masteredLanguages: Language[],
        public learningLanguages: Language[],
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
