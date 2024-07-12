import { Device } from '@capacitor/device';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import * as Sentry from '@sentry/react';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext, useConfig } from './context/ConfigurationContext';
import getConfigContextValue from './context/getConfigurationContextValue';
import Router from './presentation/router/Router';
import { useStoreActions, useStoreState } from './store/storeTypes';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import useFetchConfiguration from './presentation/hooks/useFetchConfiguration';
import useFetchI18NBackend from './presentation/hooks/useFetchI18NBackend';
import ErrorPage from './presentation/pages/ErrorPage';
import MaintenancePage from './presentation/pages/MaintenancePage';
import InstancesPage, { ValidateInstance } from './presentation/pages/mobile/InstancesPage';
import AppUrlListener from './presentation/router/AppUrlListener';
import './presentation/theme/button.css';
import './presentation/theme/global.css';
import './presentation/theme/margin.css';
import './presentation/theme/variables.css';
import Store from './store/store';

polyfillCountryFlagEmojis();
setupIonicReact();

if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        debug: import.meta.env.VITE_ENV === 'dev',
        integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
        release: 'ulep-frontend@' + APP_VERSION,
        dist: '1',
        environment: import.meta.env.VITE_ENV,
        tracesSampleRate: 1.0,
    });
}

const AppCore = () => {
    const { addDevice, deviceAdapter, notificationAdapter } = useConfig();
    const profile = useStoreState((state) => state.profile);

    useEffect(() => {
        if (profile && deviceAdapter.isNativePlatform()) {
            notificationAdapter.notificationPermission();
            notificationAdapter.registrationListener((token: string) => {
                addDevice.execute(token, deviceAdapter.isAndroid(), deviceAdapter.isIos());
            });
            notificationAdapter.errorListener((error: Error) => {
                console.error('Registration error:', error);
            });
            notificationAdapter.notificationReceivedListener((notification: any) => {
                console.log('Received notification:', notification);
            });
            notificationAdapter.notificationActionListener((notification: any) => {
                console.log('Notification action performed:', notification);
            });
        }

        return () => {
            if (deviceAdapter.isNativePlatform()) {
                notificationAdapter.removeListeners();
            }
        };
    }, [profile]);

    return (
        <IonReactRouter>
            <Router />
            <AppUrlListener />
        </IonReactRouter>
    );
};

const AppContext = () => {
    const { i18n } = useTranslation();
    const accessToken = useStoreState((state) => state.accessToken);
    const apiUrl = useStoreState((state) => state.apiUrl);
    const chatUrl = useStoreState((state) => state.chatUrl);
    const language = useStoreState((state) => state.language);
    const refreshToken = useStoreState((state) => state.refreshToken);
    const setProfile = useStoreActions((state) => state.setProfile);
    const setTokens = useStoreActions((state) => state.setTokens);
    const logout = useStoreActions((state) => state.logout);
    const setUser = useStoreActions((state) => state.setUser);

    const { configuration, error, loading } = useFetchConfiguration(import.meta.env.VITE_API_URL || apiUrl);
    const { isReady } = useFetchI18NBackend(apiUrl);

    useEffect(() => {
        const getLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();
            i18n.changeLanguage(language || deviceLanguage.value);
            document.documentElement.lang = language || deviceLanguage.value;
        };
        if (isReady) {
            getLanguage();
        }
        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='https://webstats.univ-lorraine.fr/js/container_ARY2lsO4.js'; s.parentNode?.insertBefore(g,s);
    }, [language, isReady]);

    if (error) {
        return <ErrorPage />;
    }

    //TODO(future): Real loader rather than just IonLoading doing nothing
    if (!configuration || loading) {
        return null;
    }
    if (configuration.isInMaintenance) {
        return <MaintenancePage />;
    }

    return (
        <ConfigContext.Provider
            value={getConfigContextValue({
                apiUrl: import.meta.env.VITE_API_URL || apiUrl,
                chatUrl: import.meta.env.VITE_CHAT_URL || chatUrl,
                socketChatUrl: import.meta.env.VITE_SOCKET_CHAT_URL || chatUrl,
                languageCode: i18n.language,
                accessToken,
                refreshToken,
                setProfile,
                setTokens,
                setUser,
                configuration,
                logout,
            })}
        >
            <AppCore />
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
        return (
            <InstancesPage
                onValidate={({ apiUrl, chatUrl, socketChatUrl }: ValidateInstance) =>
                    setApiUrl({ apiUrl, chatUrl, socketChatUrl })
                }
            />
        );

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
