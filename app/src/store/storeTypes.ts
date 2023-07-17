import { Action, createTypedHooks } from 'easy-peasy';
import Country from '../domain/entities/Country';
import Goal from '../domain/entities/Goal';
import Language from '../domain/entities/Language';
import ProfileSignUp from '../domain/entities/ProfileSignUp';
import University from '../domain/entities/University';
import gender from '../domain/entities/gender';
import roles from '../domain/entities/roles';

export interface TokenStorePayload {
    accessToken: string;
    refreshToken: string;
}

export interface SignUpStorePayload {
    age?: number;
    country?: Country;
    department?: string;
    diplome?: string;
    email?: string;
    firstname?: string;
    gender?: gender;
    goals?: Goal[];
    interests?: string[];
    lastname?: string;
    nativeLanguage?: Language;
    otherLanguages?: Language[];
    password?: string;
    profilePicture?: string;
    role?: roles;
    staffFunction?: string;
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
