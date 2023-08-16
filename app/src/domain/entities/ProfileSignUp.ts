import Availability from './Availability';
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

export interface Availabilites {
    monday: Availability;
    tuesday: Availability;
    wednesday: Availability;
    thursday: Availability;
    friday: Availability;
    saturday: Availability;
    sunday: Availability;
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

    public sameTandem?: boolean;

    public staffFunction?: string;

    public timezone?: string;

    public university?: University | undefined;

    constructor() {}
}

export default ProfileSignUp;
