import { useLocation } from 'react-router-dom';

const useCurrentPathname = (): string => {
    const location = useLocation();

    return location.pathname.substring(1);
};

export default useCurrentPathname;
