import { Device } from '@capacitor/device';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from './context/ConfigurationContext';
import getConfigContextValue from './context/getConfigurationContextValue';
import Router from './presentation/router/Router';
import React from 'react';
import { useStoreActions, useStoreState } from './store/storeTypes';
import * as Sentry from "@sentry/react";
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

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
import AppUrlListener from './presentation/router/AppUrlListener';
import MaintenancePage from './presentation/pages/MaintenancePage';

setupIonicReact();

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    debug: import.meta.env.VITE_ENV === "dev",
    integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay()
      ],
    release: "ulep-frontend@" + APP_VERSION,
    dist: "1",
    environment: import.meta.env.VITE_ENV,
    tracesSampleRate: 1.0,
});

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

    //TODO(future): Real loader rather than just IonLoading doing nothing
    if (!configuration || loading) {
        return null;
    }
    if(configuration.isInMaintenance) {
        return <MaintenancePage />;
    }

    return (
        <ConfigContext.Provider
            value={getConfigContextValue(
                import.meta.env.VITE_API_URL || apiUrl,
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
                <AppUrlListener />
            </IonReactRouter>
        </ConfigContext.Provider>
    );
};

const AppInstance: React.FC = () => {
    const rehydrated = useStoreRehydrated();
    const apiUrl = useStoreState((state) => state.apiUrl);
    const setApiUrl = useStoreActions((state) => state.setApiUrl);

    if (!rehydrated) {
        return null;
    }

    if (!apiUrl && !import.meta.env.VITE_API_URL)
        return <InstancesPage onValidate={(url: string) => setApiUrl({ apiUrl: url })} />;

    return <AppContext />;
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
