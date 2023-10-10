import { Action, createTypedHooks } from 'easy-peasy';
import Campus from '../domain/entities/Campus';
import Country from '../domain/entities/Country';
import Goal from '../domain/entities/Goal';
import Language from '../domain/entities/Language';
import Profile from '../domain/entities/Profile';
import ProfileSignUp, { Availabilites, BiographySignUp } from '../domain/entities/ProfileSignUp';
import University from '../domain/entities/University';
import User from '../domain/entities/User';

export interface TokenStorePayload {
    accessToken: string;
    refreshToken: string;
}

export interface SignUpStorePayload {
    age?: number;
    availabilities?: Availabilites;
    availabilityNote?: string;
    availabilityNotePrivate?: boolean;
    biography?: BiographySignUp;
    campus?: Campus;
    country?: Country;
    department?: string;
    diplome?: string;
    email?: string;
    frequency?: MeetFrequency;
    firstname?: string;
    gender?: Gender;
    goals?: Goal[];
    interests?: string[];
    isSuggested?: boolean;
    isForCertificate?: boolean;
    isForProgram?: boolean;
    lastname?: string;
    learningLanguage?: Language;
    learningLanguageLevel?: CEFR;
    nativeLanguage?: Language;
    otherLanguages?: Language[];
    password?: string;
    pedagogy?: Pedagogy;
    profilePicture?: string;
    role?: Role;
    sameAge?: boolean;
    sameGender?: boolean;
    sameTandem?: boolean;
    staffFunction?: string;
    timezone?: string;
    university?: University;
}

interface LanguagePayload {
    language: string;
}

interface ProfileStorePayload {
    profile: Profile;
}

interface UpdateProfile {
    acceptsEmail?: boolean;
    avatar?: string;
    learningLanguage?: Language;
}

interface UserStorePayload {
    user: User;
}
interface StoreInterface {
    accessToken: string;
    language: string;
    logout: Action<StoreInterface>;
    refreshToken: string;
    setLanguage: Action<StoreInterface, LanguagePayload>;
    setProfile: Action<StoreInterface, ProfileStorePayload>;
    setTokens: Action<StoreInterface, TokenStorePayload>;
    setUser: Action<StoreInterface, UserStorePayload>;
    profile: Profile | undefined;
    profileSignUp: ProfileSignUp;
    updateProfile: Action<StoreInterface, UpdateProfile>;
    updateProfileSignUp: Action<StoreInterface, SignUpStorePayload>;
    user: User | undefined;
}

const typedHooks = createTypedHooks<StoreInterface>();
export const { useStoreActions, useStoreDispatch, useStoreState } = typedHooks;
export default StoreInterface;
