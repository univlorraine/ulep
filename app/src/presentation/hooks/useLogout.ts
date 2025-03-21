import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';

const useLogout = () => {
    const { logout } = useStoreActions((store) => store);
    const { revokeSessionsUsecase } = useConfig();
    const handleLogout = async (): Promise<void> => {
        await revokeSessionsUsecase.execute();
        logout();
    };

    return { handleLogout };
};

export default useLogout;
