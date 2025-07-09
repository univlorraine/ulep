/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import * as Sentry from '@sentry/react';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { Suspense, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
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
import getSocketContextValue from './context/getSocketContextValue';
import { SocketContext } from './context/SocketContext';
import Loader from './presentation/components/Loader';
import { useAppVisibilityRefresh } from './presentation/hooks/useAppVisibilityRefresh';
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
        release: 'ulep-frontend@' + APP_VERSION,
        dist: '1',
        environment: import.meta.env.VITE_ENV,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
}

const AppCore = () => {
    const { addDevice, deviceAdapter, notificationAdapter } = useConfig();
    const profile = useStoreState((state) => state.profile);

    useAppVisibilityRefresh();

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
                console.info('Received notification:', notification);
            });
            notificationAdapter.notificationActionListener((notification: any) => {
                console.info('Notification action performed:', notification);
            });
        }

        return () => {
            if (deviceAdapter.isNativePlatform()) {
                notificationAdapter.removeListeners();
            }
        };
    }, [profile]);

    return (
        <Sentry.Profiler name="AppCore">
            <IonReactRouter>
                <Router />
                <AppUrlListener />
            </IonReactRouter>
        </Sentry.Profiler>
    );
};

const AppContext = () => {
    const accessToken = useStoreState((state) => state.accessToken);
    const apiUrl = useStoreState((state) => state.apiUrl);
    const chatUrl = useStoreState((state) => state.chatUrl);
    const refreshToken = useStoreState((state) => state.refreshToken);
    const setProfile = useStoreActions((state) => state.setProfile);
    const setTokens = useStoreActions((state) => state.setTokens);
    const logout = useStoreActions((state) => state.logout);
    const setUser = useStoreActions((state) => state.setUser);
    const { configuration, error, loading } = useFetchConfiguration(import.meta.env.VITE_API_URL || apiUrl);
    const { i18n } = useTranslation();

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
                languageCode: i18n.language,
                accessToken,
                refreshToken,
                setProfile,
                setTokens,
                setUser,
                configuration,
                logout,
                logoUrl: configuration.logoURL,
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
    const socketChatUrl = useStoreState((state) => state.socketChatUrl);
    const i18nInstance = useFetchI18NBackend(import.meta.env.VITE_API_URL || apiUrl);

    if (!rehydrated) {
        return null;
    }

    if (!apiUrl && !import.meta.env.VITE_API_URL) {
        return (
            <Suspense fallback={<Loader />}>
                <I18nextProvider i18n={i18nInstance}>
                    <InstancesPage
                        onValidate={({ apiUrl, chatUrl, socketChatUrl, jitsiUrl }: ValidateInstance) =>
                            setApiUrl({ apiUrl, chatUrl, socketChatUrl, jitsiUrl })
                        }
                    />
                </I18nextProvider>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<Loader />}>
            <I18nextProvider i18n={i18nInstance}>
                <SocketContext.Provider
                    value={getSocketContextValue({
                        socketChatUrl: import.meta.env.VITE_SOCKET_CHAT_URL || socketChatUrl,
                    })}
                >
                    <AppContext />
                </SocketContext.Provider>
            </I18nextProvider>
        </Suspense>
    );
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
