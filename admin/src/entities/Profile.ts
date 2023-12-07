import Interest from './Interest';
import Language from './Language';
import Objective from './Objective';
import User from './User';

export type Profile = {
    id: string;
    user: User;
    nativeLanguage: Language;
    masteredLanguages: Language[];
    meetingFrequency: string;
    objectives: Objective[];
    interests: Interest[];
    biography?: { [key: string]: string };
    createdAt?: Date;
};

export const getProfileDisplayName = (profile?: Profile): string =>
    profile ? `${profile.user.lastname} ${profile.user.firstname}` : '';
