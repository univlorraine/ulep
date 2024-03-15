import { useEffect } from 'react';
import { useStoreState } from '../../store/storeTypes';
import { useHistory } from 'react-router';

const useRedirectToHomeIfLogged = () => {
    const token = useStoreState((state) => state.accessToken);
    const profile = useStoreState((state) => state.profile);
    const history = useHistory();

    useEffect(() => {
        if (token && profile) {
            history.push("/home");
        }
    }, []);
};

export default useRedirectToHomeIfLogged;
