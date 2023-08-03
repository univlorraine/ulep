import { Action, createTypedHooks } from 'easy-peasy';
import Country from '../domain/entities/Country';
import Goal from '../domain/entities/Goal';
import Language from '../domain/entities/Language';
import Profile from '../domain/entities/Profile';
import ProfileSignUp, { AvailabilitesSignUp, BiographySignUp } from '../domain/entities/ProfileSignUp';
import University from '../domain/entities/University';

export interface TokenStorePayload {
    accessToken: string;
    refreshToken: string;
}

export interface SignUpStorePayload {
    age?: number;
    availabilities?: AvailabilitesSignUp;
    biography?: BiographySignUp;
    country?: Country;
    department?: string;
    diplome?: string;
    email?: string;
    frequency?: MeetFrequency;
    firstname?: string;
    gender?: Gender;
    goals?: Goal[];
    interests?: string[];
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
    site?: string;
    staffFunction?: string;
    timezone?: string;
    university?: University;
}

interface ProfileStorePayload {
    profile: Profile;
}

interface UpdateProfile {
    avatar: string;
}
interface StoreInterface {
    accessToken: string;
    refreshToken: string;
    setProfile: Action<StoreInterface, ProfileStorePayload>;
    setTokens: Action<StoreInterface, TokenStorePayload>;
    removeTokens: Action<StoreInterface>;
    profile: Profile | undefined;
    profileSignUp: ProfileSignUp;
    updateProfile: Action<StoreInterface, UpdateProfile>;
    updateProfileSignUp: Action<StoreInterface, SignUpStorePayload>;
}

const typedHooks = createTypedHooks<StoreInterface>();
export const { useStoreActions, useStoreDispatch, useStoreState } = typedHooks;
export default StoreInterface;
