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

import { action, createStore, persist } from 'easy-peasy';
import ProfileSignUp from '../domain/entities/ProfileSignUp';
import TokenStoreTypes from './storeTypes';

const Store = createStore<TokenStoreTypes>(
    persist(
        {
            accessToken: '',
            newsFilter: {
                language: [],
            },
            apiUrl: '',
            currentLearningWorkspace: undefined,
            currentLearningWorkspaceIndex: undefined,
            chatUrl: '',
            socketChatUrl: '',
            jitsiUrl: import.meta.env.VITE_JITSI_URL,
            language: '',
            refreshToken: '',
            refreshReports: false,
            isRtl: undefined,
            setCurrentLearningWorkspace: action((state, payload) => {
                state.currentLearningWorkspace = payload.learningWorkspace;
                state.currentLearningWorkspaceIndex = payload.index;
            }),
            setRtl: action((state, payload) => {
                state.isRtl = payload.isRtl;
            }),
            setRefreshReports: action((state) => {
                state.refreshReports = !state.refreshReports;
            }),
            setApiUrl: action((state, payload) => {
                state.apiUrl = payload.apiUrl;
                state.chatUrl = payload.chatUrl;
                state.socketChatUrl = payload.socketChatUrl;
                state.jitsiUrl = payload.jitsiUrl;
            }),
            setLanguage: action((state, payload) => {
                state.language = payload.language;
            }),
            setNewsFilter: action((state, payload) => {
                state.newsFilter.language = payload.language;
            }),
            setProfile: action((state, payload) => {
                state.profile = payload.profile;
                if (state.profileSignUp) {
                    state.profileSignUp = new ProfileSignUp();
                }
            }),
            setTokens: action((state, payload) => {
                state.accessToken = payload.accessToken ?? state.accessToken;
                state.refreshToken = payload.refreshToken ?? state.refreshToken;
            }),
            setUser: action((state, payload) => {
                state.user = payload.user ?? state.user;
                state.profileSignUp = payload.keepProfileSignUp ? state.profileSignUp : new ProfileSignUp();
                state.profile = payload.keepProfile ? state.profile : undefined;
            }),
            logout: action((state) => {
                state.accessToken = '';
                state.profile = undefined;
                state.refreshToken = '';
                state.user = undefined;
                state.apiUrl = '';
                state.chatUrl = '';
                state.socketChatUrl = '';
                state.currentLearningWorkspace = undefined;
                state.currentLearningWorkspaceIndex = undefined;
            }),
            profile: undefined,
            profileSignUp: new ProfileSignUp(),
            updateProfile: action((state, payload) => {
                const profile = state.profile;
                if (profile && payload.avatar) profile.user.avatar = payload.avatar;
                if (profile && payload.learningLanguage) {
                    state.profileSignUp = new ProfileSignUp();
                    profile.learningLanguages = [...profile.learningLanguages, payload.learningLanguage];
                }
                if (profile && payload.acceptsEmail !== undefined) profile.user.acceptsEmail = payload.acceptsEmail;
                if (profile && payload.university) profile.user.university = payload.university;
            }),
            updateProfileSignUp: action((state, payload) => {
                const profile = state.profileSignUp;
                if (payload.age) profile.age = payload.age;
                if (payload.availabilities) profile.availabilities = payload.availabilities;
                if (payload.availabilityNote) profile.availabilityNote = payload.availabilityNote;
                if (payload.availabilityNotePrivate) profile.availabilityNotePrivate = payload.availabilityNotePrivate;
                if (payload.biography) profile.biography = payload.biography;
                if (payload.campus) profile.campus = payload.campus;
                if (payload.country) profile.country = payload.country;
                if (payload.department) profile.department = payload.department;
                if (payload.diplome) profile.diplome = payload.diplome;
                if (payload.email) profile.email = payload.email;
                if (payload.firstname) profile.firstname = payload.firstname;
                if (payload.frequency) profile.frequency = payload.frequency;
                if (payload.gender) profile.gender = payload.gender;
                if (payload.goals) profile.goals = payload.goals;
                if (payload.interests) profile.interests = payload.interests;
                if (payload.isSuggested !== undefined) profile.isSuggested = payload.isSuggested;
                if (payload.isForCertificate) profile.isForCertificate = payload.isForCertificate;
                if (payload.isForProgram) profile.isForProgram = payload.isForProgram;
                if (payload.lastname) profile.lastname = payload.lastname;
                if (payload.learningLanguage) profile.learningLanguage = payload.learningLanguage;
                if (payload.learningLanguageLevel) profile.learningLanguageLevel = payload.learningLanguageLevel;
                if (payload.nativeLanguage) profile.nativeLanguage = payload.nativeLanguage;
                if (payload.otherLanguages) profile.otherLanguages = payload.otherLanguages;
                if (payload.password) profile.password = payload.password;
                if (payload.pedagogy) profile.pedagogy = payload.pedagogy;
                if (payload.profilePicture) profile.profilePicture = payload.profilePicture;
                if (payload.role) profile.role = payload.role;
                if (payload.sameAge) profile.sameAge = payload.sameAge;
                if (payload.sameGender) profile.sameGender = payload.sameGender;
                if (payload.sameTandem) profile.sameTandem = payload.sameTandem;
                if (payload.staffFunction) profile.staffFunction = payload.staffFunction;
                if (payload.timezone) profile.timezone = payload.timezone;
                if (payload.university) profile.university = payload.university;
            }),
            user: undefined,
        },
        { storage: 'localStorage' }
    )
);

export default Store;
