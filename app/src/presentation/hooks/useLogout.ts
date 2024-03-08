import { useHistory } from "react-router";
import { useConfig } from "../../context/ConfigurationContext";
import { useStoreActions } from "../../store/storeTypes";

interface UseLogoutOpts {
    // Force redirect using window.location.href rather than history navigation.
    // This can be usefull for component outside of App router
    forceRedirect?: boolean;
    redirectUrl?: string;
}


const useLogout = (opts?: UseLogoutOpts) => {
    const history = useHistory();
    const { logout } = useStoreActions((store) => store);
    const { revokeSessionsUsecase } = useConfig();
    
    const handleLogout = async (): Promise<void> => {
        await revokeSessionsUsecase.execute();
        logout();

        const redirectUrl = opts?.redirectUrl || "/";
        if (!!opts?.forceRedirect) {
            window.location.href = redirectUrl;
        } else {
            history.push(redirectUrl);
        }
    };

    return { handleLogout };
};

export default useLogout;
