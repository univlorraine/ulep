import Availability from './Availability';
import Country from './Country';
import Goal from './Goal';
import Language from './Language';
import University from './University';
import gender from './gender';
import roles from './roles';

export interface BiographySignUp {
    incredible: string;
    place: string;
    power: string;
    travel: string;
}

export interface AvailabilitesSignUp {
    monday: Availability;
    tuesday: Availability;
    wednesday: Availability;
    thursday: Availability;
    friday: Availability;
    saturday: Availability;
    sunday: Availability;
}

class ProfileSignUp {
    private _age?: number;

    private _availabilities?: AvailabilitesSignUp;

    private _biography?: BiographySignUp;

    private _country?: Country;

    private _department?: string;

    private _diplome?: string;

    private _email?: string;

    private _firstname?: string;

    private _gender?: gender;

    private _goals?: Goal[];

    private _interests?: string[];

    private _lastname?: string;

    private _nativeLanguage?: Language;

    private _password?: string;

    private _profilePicture?: string;

    private otherLaguages?: Language[];

    private _role?: roles;

    private _staffFunction?: string;

    private _university?: University;

    constructor() {}

    set age(age: number) {
        this._age = age;
    }

    set availabilities(availabilities: AvailabilitesSignUp) {
        this._availabilities = availabilities;
    }

    set biography(biography: BiographySignUp) {
        this._biography = biography;
    }

    set country(country: Country) {
        this._country = country;
    }

    set department(department: string) {
        this._department = department;
    }

    set diplome(diplome: string) {
        this._diplome = diplome;
    }

    set email(email: string) {
        this._email = email;
    }

    set firstname(firstname: string) {
        this._firstname = firstname;
    }

    set gender(gender: gender) {
        this._gender = gender;
    }

    set goals(goals: Goal[]) {
        this._goals = goals;
    }

    set interests(interests: string[]) {
        this._interests = interests;
    }

    set lastname(lastname: string) {
        this._lastname = lastname;
    }

    set nativeLanguage(nativeLanguage: Language) {
        this._nativeLanguage = nativeLanguage;
    }

    set otherLanguages(otherLanguages: Language[]) {
        this.otherLaguages = otherLanguages;
    }

    set password(password: string) {
        this._password = password;
    }

    set profilePicture(profilePicture: string) {
        this._profilePicture = profilePicture;
    }

    set role(role: roles) {
        this._role = role;
    }

    set staffFunction(staffFunction: string) {
        this._staffFunction = staffFunction;
    }

    set university(university: University) {
        this._university = university;
    }
}

export default ProfileSignUp;
