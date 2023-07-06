import { Action, createTypedHooks } from 'easy-peasy';

export interface TokenStorePayload {
    accessToken: string;
    refreshToken: string;
}

interface TokenStoreInterface {
    accessToken: string;
    refreshToken: string;
    setTokens: Action<TokenStoreInterface, TokenStorePayload>;
    removeTokens: Action<TokenStoreInterface>;
}

const typedHooks = createTypedHooks<TokenStoreInterface>();
export const { useStoreActions, useStoreDispatch, useStoreState } = typedHooks;
export default TokenStoreInterface;
