import { Device } from '@capacitor/device';
import { IonApp, setupIonicReact } from '@ionic/react';
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

setupIonicReact();

const AppContext = () => {
    const rehydrated = useStoreRehydrated();
    const accessToken = useStoreState((state) => state.accessToken);
    const refreshToken = useStoreState((state) => state.refreshToken);
    const setProfile = useStoreActions((state) => state.setProfile);
    const setTokens = useStoreActions((state) => state.setTokens);
    const logout = useStoreActions((state) => state.logout);
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
        document.documentElement.style.setProperty('--primary-color', configuration.primaryColor);
        document.documentElement.style.setProperty('--primary-dark-color', configuration.primaryDarkColor);
        document.documentElement.style.setProperty('--secondary-color', configuration.secondaryColor);
        document.documentElement.style.setProperty('--secondary-dark-color', configuration.secondaryDarkColor);
    }, []);

    if (!rehydrated) {
        return <div />;
    }

    return (
        <ConfigContext.Provider
            value={getConfigContextValue(accessToken, refreshToken, setProfile, setTokens, logout, configuration)}
        >
            <IonReactRouter>
                <Router />
            </IonReactRouter>
        </ConfigContext.Provider>
    );
};

const App: React.FC = () => {
    const { i18n } = useTranslation();
    useEffect(() => {
        const getLanguage = async () => {
            const language = await Device.getLanguageCode();
            i18n.changeLanguage(language.value);
        };
        getLanguage();
    }, []);

    return (
        <IonApp>
            <StoreProvider store={Store}>
                <AppContext />
            </StoreProvider>
        </IonApp>
    );
};

export default App;
