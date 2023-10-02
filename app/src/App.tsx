import { Device } from '@capacitor/device';
import { IonApp, isPlatform, setupIonicReact } from '@ionic/react';
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
import Configuration from './domain/entities/Confirguration';
import './presentation/theme/button.css';
import './presentation/theme/global.css';
import './presentation/theme/margin.css';
import './presentation/theme/variables.css';
import Store from './store/store';
import InstancesPage from './presentation/pages/mobile/InstancesPage';

setupIonicReact();

const AppContext = () => {
    const { i18n } = useTranslation();
    const accessToken = useStoreState((state) => state.accessToken);
    const language = useStoreState((state) => state.language);
    const refreshToken = useStoreState((state) => state.refreshToken);
    const setProfile = useStoreActions((state) => state.setProfile);
    const setTokens = useStoreActions((state) => state.setTokens);
    const setUser = useStoreActions((state) => state.setUser);
    const configuration = new Configuration(
        'Université de Lorraine',
        'Université de Lorraine',
        'contact@email.com',
        '#FDEE66',
        '#B6AA43',
        '#EDDF5E',
        '#8BC4C4',
        '#4B7676',
        '#7CB8B8'
    );

    useEffect(() => {
        const getLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();
            i18n.changeLanguage(language || deviceLanguage.value);
        };
        getLanguage();
    }, [language]);

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', configuration.primaryColor);
        document.documentElement.style.setProperty('--primary-dark-color', configuration.primaryDarkColor);
        document.documentElement.style.setProperty('--secondary-color', configuration.secondaryColor);
        document.documentElement.style.setProperty('--secondary-dark-color', configuration.secondaryDarkColor);
    }, []);

    return (
        <ConfigContext.Provider
            value={getConfigContextValue(
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

    // We check if we are on ios / android and if we already got an api url in env variable ( on dev for exemple )
    if (isPlatform('hybrid') && !apiUrl && !import.meta.env.VITE_API_URL)
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
