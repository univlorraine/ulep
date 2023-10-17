import { Device } from '@capacitor/device';
import { IonApp, IonLoading, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from './context/ConfigurationContext';
import getConfigContextValue from './context/getConfigurationContextValue';
import Router from './presentation/router/Router';
import { useStoreActions, useStoreState } from './store/storeTypes';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './presentation/theme/button.css';
import './presentation/theme/global.css';
import './presentation/theme/margin.css';
import './presentation/theme/variables.css';
import Store from './store/store';
import InstancesPage from './presentation/pages/mobile/InstancesPage';
import useFetchConfiguration from './presentation/hooks/useFetchConfiguration';
import useFetchI18NBackend from './presentation/hooks/useFetchI18NBackend';
import ErrorPage from './presentation/pages/ErrorPage';

setupIonicReact();

const AppContext = () => {
    const { i18n } = useTranslation();
    const accessToken = useStoreState((state) => state.accessToken);
    const apiUrl = useStoreState((state) => state.apiUrl);
    const language = useStoreState((state) => state.language);
    const refreshToken = useStoreState((state) => state.refreshToken);
    const setProfile = useStoreActions((state) => state.setProfile);
    const setTokens = useStoreActions((state) => state.setTokens);
    const setUser = useStoreActions((state) => state.setUser);

    const { configuration, error, loading } = useFetchConfiguration(import.meta.env.VITE_API_URL || apiUrl);

    useFetchI18NBackend(apiUrl);

    useEffect(() => {
        const getLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();
            i18n.changeLanguage(language || deviceLanguage.value);
        };
        getLanguage();
    }, [language]);

    if (error) {
        return <ErrorPage />;
    }

    if (!configuration || loading) {
        return <IonLoading />;
    }

    return (
        <ConfigContext.Provider
            value={getConfigContextValue(
                apiUrl,
                i18n.language,
                accessToken,
                refreshToken,
                setProfile,
                setTokens,
                setUser,
                configuration
            )}
        >
            <IonReactRouter>
                <Router />
            </IonReactRouter>
        </ConfigContext.Provider>
    );
};

const AppInstance: React.FC = () => {
    const rehydrated = useStoreRehydrated();
    const apiUrl = useStoreState((state) => state.apiUrl);
    const setApiUrl = useStoreActions((state) => state.setApiUrl);

    if (!rehydrated) {
        return <div />;
    }

    // We check if we have an api url on env variable or on localstorage ( web and hybrid )
    if (!apiUrl && !import.meta.env.VITE_API_URL)
        return <InstancesPage onValidate={(url: string) => setApiUrl({ apiUrl: url })} />;
    else return <AppContext />;
};

const App: React.FC = () => {
    return (
        <IonApp>
            <StoreProvider store={Store}>
                <AppInstance />
            </StoreProvider>
        </IonApp>
    );
};

export default App;
