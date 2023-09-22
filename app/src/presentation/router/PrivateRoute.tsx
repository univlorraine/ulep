import { ComponentType } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';

interface PrivateRouteProps extends RouteProps {
    component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...props }) => {
    const token = useStoreState((state) => state.accessToken);

    if(!token){
        window.location.href = '/';
    }

    return (
        <Route
            {...props}
            render={(props) =>
                token && (
                    <Component {...props} />
                )
            }
        />
    );
};

export default PrivateRoute;
