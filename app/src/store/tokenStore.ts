/* eslint-disable no-param-reassign */
import { action, createStore, persist } from 'easy-peasy';
import TokenStoreTypes from './tokenStoreTypes';

// @ts-ignore
const userStore = createStore<TokenStoreTypes>(
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
    })
);

export default userStore;
