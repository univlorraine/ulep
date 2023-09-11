import Campus from './Campus';
import Interest from './Interest';
import Language from './Language';
import Objective from './Objective';
import User from './User';

export type Profile = {
    id: string;
    user: User;
    nativeLanguage: Language;
    masteredLanguages: Language[];
    learningType: string;
    meetingFrequency: string;
    sameGender: boolean;
    sameAge: boolean;
    objectives: Objective[];
    interests: Interest[];
    biography?: { [key: string]: string };
    campus?: Campus;
    certificateOption?: boolean;
    specificProgram?: boolean;
    createdAt?: Date;
};

export const getProfileDisplayName = (profile?: Profile): string =>
    profile ? `${profile.user.firstname} ${profile.user.lastname}` : '';

export const getProfileUniversityAndCampusString = (profile?: Profile) => {
    if (!profile) {
        return '';
    }
    if (profile.campus) {
        return `${profile.user.university.name} - ${profile.campus.name}`;
    }

    return `${profile.user.university.name}`;
};
