import Campus from './Campus';
import Country from './Country';
import Goal from './Goal';
import Language from './Language';
import University from './University';

export interface BiographySignUp {
    incredible: string;
    place: string;
    power: string;
    travel: string;
}

export enum AvailabilitesOptions {
    UNAVAILABLE = 'UNAVAILABLE',
    AVAILABLE = 'AVAILABLE',
    VERY_AVAILABLE = 'VERY_AVAILABLE',
}
export interface Availabilites {
    monday: AvailabilitiesOptions;
    tuesday: AvailabilitiesOptions;
    wednesday: AvailabilitiesOptions;
    thursday: AvailabilitiesOptions;
    friday: AvailabilitiesOptions;
    saturday: AvailabilitiesOptions;
    sunday: AvailabilitiesOptions;
}

class ProfileSignUp {
    public age?: number;

    public availabilities?: Availabilites;

    public availabilityNote?: string;

    public availabilityNotePrivate?: boolean;

    public biography?: BiographySignUp;

    public campus?: Campus;

    public country?: Country;

    public department?: string;

    public diplome?: string;

    public email?: string;

    public firstname?: string;

    public frequency?: MeetFrequency;

    public gender?: Gender;

    public goals?: Goal[];

    public interests?: string[];

    public isSuggested?: boolean;

    public isForCertificate?: boolean;

    public isForProgram?: boolean;

    public learningLanguage?: Language;

    public learningLanguageLevel?: CEFR;

    public lastname?: string;

    public nativeLanguage?: Language;

    public password?: string;

    public pedagogy?: Pedagogy;

    public profilePicture?: string;

    public otherLanguages?: Language[];

    public role?: Role;

    public sameAge?: boolean;

    public sameGender?: boolean;

    public sameTandemEmail?: string;

    public staffFunction?: string;

    public timezone?: string;

    public university?: University | undefined;

    constructor() {}
}

export default ProfileSignUp;
