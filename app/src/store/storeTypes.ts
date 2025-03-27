/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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

interface UpdateProfile {
    acceptsEmail?: boolean;
    avatar?: MediaObject;
    learningLanguage?: LearningLanguage;
    university?: University;
}

interface SetRtlPayload {
    isRtl: boolean;
}

interface NewsFilterPayload {
    language: Language[];
}

interface UserStorePayload {
    user: User;
    keepProfile?: boolean;
    keepProfileSignUp?: boolean;
}

interface CurrentLearningWorkspacePayload {
    learningWorkspace: Tandem;
    index: number;
}

interface StoreInterface {
    accessToken: string;
    newsFilter: {
        language: Language[];
    };
    apiUrl: string;
    chatUrl: string;
    currentLearningWorkspace?: Tandem;
    currentLearningWorkspaceIndex?: number;
    socketChatUrl: string;
    jitsiUrl: string;
    isRtl?: boolean;
    language: string;
    logout: Action<StoreInterface>;
    refreshToken: string;
    refreshReports: boolean;
    setRefreshReports: Action<StoreInterface>;
    setApiUrl: Action<StoreInterface, ApiUrlPayload>;
    setLanguage: Action<StoreInterface, LanguagePayload>;
    setRtl: Action<StoreInterface, SetRtlPayload>;
    setNewsFilter: Action<StoreInterface, NewsFilterPayload>;
    setCurrentLearningWorkspace: Action<StoreInterface, CurrentLearningWorkspacePayload>;
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
