import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import SettingsContent from '../../components/contents/SettingsContent';
import { useStoreActions } from '../../../store/storeTypes';

const SettingsPage: React.FC = () => {
    const history = useHistory();
    const logout = useStoreActions((store) => store.logout);

    return (
        <IonPage>
            <SettingsContent onBackPressed={history.goBack} onDisconnect={logout} />
        </IonPage>
    );
};

export default SettingsPage;
