import Interest from './Interest';
import Language from './Language';
import Objective from './Objective';
import User from './User';

export interface Profile {
    id: string;
    user: User;
    nativeLanguage: Language;
    masteredLanguages: Language[];
    learningLanguages: Language[];
    meetingFrequency: string;
    objectives: Objective[];
    interests: Interest[];
    biography?: { [key: string]: string };
    createdAt?: Date;
}

export interface ProfileFormPayload {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    contactId?: string;
}

export const getProfileDisplayName = (profile?: Profile): string =>
    profile ? `${profile.user.lastname} ${profile.user.firstname}` : '';
