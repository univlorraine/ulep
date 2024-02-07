import { ComponentType } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';
import { useIonRouter } from '@ionic/react';

interface PrivateRouteProps extends RouteProps {
    component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...props }) => {
    const token = useStoreState((state) => state.accessToken);
    const router = useIonRouter();

    if (!token) {
        router.push('/login', 'root', 'replace');
    }

    return <Route {...props} render={(props) => token && <Component {...props} />} />;
};

export default PrivateRoute;
