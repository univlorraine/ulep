import { Action, createTypedHooks } from 'easy-peasy';
import Country from '../domain/entities/Country';
import Goal from '../domain/entities/Goal';
import Language from '../domain/entities/Language';
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
    lastname?: string;
    learningLanguage?: Language;
    nativeLanguage?: Language;
    otherLanguages?: Language[];
    password?: string;
    pedagogy?: Pedagogy;
    profilePicture?: string;
    role?: Role;
    site?: string;
    staffFunction?: string;
    timezone?: string;
    university?: University;
}

interface StoreInterface {
    accessToken: string;
    refreshToken: string;
    setTokens: Action<StoreInterface, TokenStorePayload>;
    removeTokens: Action<StoreInterface>;
    profileSignUp: ProfileSignUp;
    updateProfileSignUp: Action<StoreInterface, SignUpStorePayload>;
}

const typedHooks = createTypedHooks<StoreInterface>();
export const { useStoreActions, useStoreDispatch, useStoreState } = typedHooks;
export default StoreInterface;
