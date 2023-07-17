import { action, createStore, persist } from 'easy-peasy';
import ProfileSignUp from '../domain/entities/ProfileSignUp';
import TokenStoreTypes from './storeTypes';

const Store = createStore<TokenStoreTypes>(
    persist({
        accessToken: '',
        refreshToken: '',
        setTokens: action((state, payload) => {
            state.accessToken = payload.accessToken ? payload.accessToken : state.accessToken;
            state.refreshToken = payload.refreshToken ? payload.refreshToken : state.refreshToken;
        }),
        removeTokens: action((state) => {
            state.accessToken = '';
            state.refreshToken = '';
        }),
        profileSignUp: new ProfileSignUp(),
        updateProfileSignUp: action((state, payload) => {
            const profile = state.profileSignUp;
            if (payload.age) profile.age = payload.age;
            if (payload.country) profile.country = payload.country;
            if (payload.department) profile.department = payload.department;
            if (payload.diplome) profile.diplome = payload.diplome;
            if (payload.email) profile.email = payload.email;
            if (payload.firstname) profile.firstname = payload.firstname;
            if (payload.gender) profile.gender = payload.gender;
            if (payload.goals) profile.goals = payload.goals;
            if (payload.interests) profile.interests = payload.interests;
            if (payload.lastname) profile.lastname = payload.lastname;
            if (payload.nativeLanguage) profile.nativeLanguage = payload.nativeLanguage;
            if (payload.otherLanguages) profile.otherLanguages = payload.otherLanguages;
            if (payload.password) profile.password = payload.password;
            if (payload.profilePicture) profile.profilePicture = payload.profilePicture;
            if (payload.role) profile.role = payload.role;
            if (payload.staffFunction) profile.staffFunction = payload.staffFunction;
            if (payload.university) profile.university = payload.university;
        }),
    })
);

export default Store;
