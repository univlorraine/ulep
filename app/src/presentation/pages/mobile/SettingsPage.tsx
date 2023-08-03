import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import SettingsContent from '../../components/contents/SettingsContent';

const SettingsPage: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage>
            <SettingsContent onBackPressed={history.goBack} />
        </IonPage>
    );
};

export default SettingsPage;
