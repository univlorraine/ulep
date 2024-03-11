import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import SettingsContent from '../../components/contents/SettingsContent';
import useLogout from '../../hooks/useLogout';

const SettingsPage: React.FC = () => {
    const history = useHistory();
    const { handleLogout } = useLogout();

    return (
        <IonPage>
            <SettingsContent onBackPressed={history.goBack} onDisconnect={handleLogout} />
        </IonPage>
    );
};

export default SettingsPage;
