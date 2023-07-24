import { Action, createTypedHooks } from 'easy-peasy';
import Country from '../domain/entities/Country';
import Goal from '../domain/entities/Goal';
import Language from '../domain/entities/Language';
import ProfileSignUp, { AvailabilitesSignUp, BiographySignUp, frequency } from '../domain/entities/ProfileSignUp';
import University from '../domain/entities/University';
import gender from '../domain/entities/gender';
import pedagogy from '../domain/entities/pedagogy';
import roles from '../domain/entities/roles';

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
    frequency?: frequency;
    firstname?: string;
    gender?: gender;
    goals?: Goal[];
    interests?: string[];
    lastname?: string;
    learningLanguage?: Language;
    nativeLanguage?: Language;
    otherLanguages?: Language[];
    password?: string;
    pedagogy?: pedagogy;
    profilePicture?: string;
    role?: roles;
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
