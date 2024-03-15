import { ReactNode } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';

interface PrivateRouteProps extends RouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...props }) => {
    const token = useStoreState((state) => state.accessToken);

    if (!token) {
        window.location.href = '/';
        return null;
    }

    return <Route {...props}>{children}</Route>;
};

export default PrivateRoute;
