import { ComponentType } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface PrivateRouteProps extends RouteProps {
    component: ComponentType<any>;
}

const MobileRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...props }) => {
    const token = useStoreState((state) => state.accessToken);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    if(!token){
        window.location.href = '/';
    }

    if(!isHybrid){
        window.location.href = '/home';
    }

    return (
        <Route
            {...props}
            render={(props) =>
                token && isHybrid && (
                    <Component {...props} />
                )
            }
        />
    );
};

export default MobileRoute;
