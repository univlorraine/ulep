import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import OfflineRouter from './presentation/router/OfflineRouter';
import { useEffect } from 'react';
import { Device } from '@capacitor/device';
import { useTranslation } from 'react-i18next';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './presentation/theme/button.css';
import './presentation/theme/global.css';
import './presentation/theme/input.css';
import './presentation/theme/margin.css';
import './presentation/theme/variables.css';

setupIonicReact();

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
            <IonReactRouter>
                <OfflineRouter />
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
