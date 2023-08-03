import { action, createStore, persist } from 'easy-peasy';
import ProfileSignUp from '../domain/entities/ProfileSignUp';
import TokenStoreTypes from './storeTypes';

const Store = createStore<TokenStoreTypes>(
    persist({
        accessToken: '',
        refreshToken: '',
        setProfile: action((state, payload) => {
            state.profile = payload.profile;
            state.profileSignUp = new ProfileSignUp();
        }),
        setTokens: action((state, payload) => {
            state.accessToken = payload.accessToken ? payload.accessToken : state.accessToken;
            state.refreshToken = payload.refreshToken ? payload.refreshToken : state.refreshToken;
        }),
        logout: action((state) => {
            state.accessToken = '';
            state.profile = undefined;
            state.refreshToken = '';
        }),
        profile: undefined,
        profileSignUp: new ProfileSignUp(),
        updateProfile: action((state, payload) => {
            const profile = state.profile;
            if (profile && payload.avatar) profile.avatar = payload.avatar;
        }),
        updateProfileSignUp: action((state, payload) => {
            const profile = state.profileSignUp;
            if (payload.age) profile.age = payload.age;
            if (payload.availabilities) profile.availabilities = payload.availabilities;
            if (payload.biography) profile.biography = payload.biography;
            if (payload.country) profile.country = payload.country;
            if (payload.department) profile.department = payload.department;
            if (payload.diplome) profile.diplome = payload.diplome;
            if (payload.email) profile.email = payload.email;
            if (payload.firstname) profile.firstname = payload.firstname;
            if (payload.frequency) profile.frequency = payload.frequency;
            if (payload.gender) profile.gender = payload.gender;
            if (payload.goals) profile.goals = payload.goals;
            if (payload.interests) profile.interests = payload.interests;
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
            if (payload.site) profile.site = payload.site;
            if (payload.staffFunction) profile.staffFunction = payload.staffFunction;
            if (payload.timezone) profile.timezone = payload.timezone;
            if (payload.university) profile.university = payload.university;
        }),
    })
);

export default Store;
