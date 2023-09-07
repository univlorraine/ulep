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
    learningType: string; // TODO(NOW+1): see if enum
    meetingFrequency: string;
    sameGender: boolean;
    sameAge: boolean;
    objectives: Objective[];
    interests: Interest[]; // TODO(NOW+1): see if enum
    biography?: { [key: string]: string };
    campus?: Campus;
    certificateOption?: boolean;
    specificProgram?: boolean;
    createdAt?: Date;
};

export const getProfileDisplayName = (profile: Profile): string => `${profile.user.firstname} ${profile.user.lastname}`;
