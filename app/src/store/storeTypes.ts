import { Action, createTypedHooks } from 'easy-peasy';
import Campus from '../domain/entities/Campus';
import Country from '../domain/entities/Country';
import Goal from '../domain/entities/Goal';
import Language from '../domain/entities/Language';
import LearningLanguage from '../domain/entities/LearningLanguage';
import MediaObject from '../domain/entities/MediaObject';
import Profile from '../domain/entities/Profile';
import ProfileSignUp, { Availabilites, BiographySignUp } from '../domain/entities/ProfileSignUp';
import Tandem from '../domain/entities/Tandem';
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
    profilePicture?: File;
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

interface ApiUrlPayload {
    apiUrl: string;
    chatUrl: string;
    socketChatUrl: string;
    jitsiUrl: string;
}

interface ProfileStorePayload {
    profile: Profile;
}

interface TandemStorePayload {
    tandem: Tandem;
}

interface LastConnectionStorePayload {
    lastConnection: Date;
}

interface UpdateProfile {
    acceptsEmail?: boolean;
    avatar?: MediaObject;
    learningLanguage?: LearningLanguage;
    university?: University;
}

interface UserStorePayload {
    user: User;
    keepProfile?: boolean;
    keepProfileSignUp?: boolean;
}
interface StoreInterface {
    accessToken: string;
    apiUrl: string;
    chatUrl: string;
    socketChatUrl: string;
    jitsiUrl: string;
    language: string;
    lastConnection: Date | undefined;
    logout: Action<StoreInterface>;
    refreshToken: string;
    refreshReports: boolean;
    setRefreshReports: Action<StoreInterface>;
    setApiUrl: Action<StoreInterface, ApiUrlPayload>;
    setLanguage: Action<StoreInterface, LanguagePayload>;
    setProfile: Action<StoreInterface, ProfileStorePayload>;
    setTokens: Action<StoreInterface, TokenStorePayload>;
    setUser: Action<StoreInterface, UserStorePayload>;
    setLastConnection: Action<StoreInterface, LastConnectionStorePayload>;
    profile: Profile | undefined;
    profileSignUp: ProfileSignUp;
    updateProfile: Action<StoreInterface, UpdateProfile>;
    updateProfileSignUp: Action<StoreInterface, SignUpStorePayload>;
    user: User | undefined;
    currentTandem: Tandem | undefined;
    setCurrentTandem: Action<StoreInterface, TandemStorePayload>;
}

const typedHooks = createTypedHooks<StoreInterface>();
export const { useStoreActions, useStoreDispatch, useStoreState } = typedHooks;
export default StoreInterface;
