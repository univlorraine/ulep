import { useStoreState } from '../../store/storeTypes';

const useRedirectToHomeIfLogged = () => {
    const token = useStoreState((state) => state.accessToken);

    if (token) window.location.href = '/home';
};

export default useRedirectToHomeIfLogged;
