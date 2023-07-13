import { Device } from '@capacitor/device';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from './context/ConfigurationContext';
import getConfigContextValue from './context/getConfigurationContextValue';
import OfflineRouter from './presentation/router/OfflineRouter';
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

setupIonicReact();

const AppContext = () => {
    const rehydrated = useStoreRehydrated();
    const accessToken = useStoreState((state) => state.accessToken);
    const refreshToken = useStoreState((state) => state.refreshToken);
    const setTokens = useStoreActions((state) => state.setTokens);
    const deleteTokens = useStoreActions((state) => state.removeTokens);

    if (!rehydrated) {
        return <div />;
    }

    return (
        <ConfigContext.Provider value={getConfigContextValue(accessToken, refreshToken, setTokens, deleteTokens)}>
            <IonReactRouter>
                <OfflineRouter />
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
