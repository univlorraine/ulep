import { useStoreState } from '../../store/storeTypes';

const useRedirectToHomeIfLogged = () => {
    const token = useStoreState((state) => state.accessToken);
    const profile = useStoreState((state) => state.profile);

    if (token && profile) window.location.href = '/home';
};

export default useRedirectToHomeIfLogged;
