import { ReactNode } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface PrivateRouteProps extends RouteProps {
    children: ReactNode;
}

const MobileRoute: React.FC<PrivateRouteProps> = ({ children, ...props }) => {
    const token = useStoreState((state) => state.accessToken);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    if (!token) {
        window.location.href = '/';
        return null;
    }

    if (!isHybrid) {
        window.location.href = '/home';
        return null;
    }

    return <Route {...props}>{children}</Route>;
};

export default MobileRoute;
