import { ComponentType } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';

interface PrivateRouteProps extends RouteProps {
    component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...props }) => {
    const token = useStoreState((state) => state.accessToken);

    return (
        <Route
            {...props}
            render={(props) =>
                token ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/signup', // Mettez ici la route vers laquelle vous voulez rediriger si le token n'existe pas
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
