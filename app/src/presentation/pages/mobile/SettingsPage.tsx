import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import SettingsContent from '../../components/contents/SettingsContent';
import { useStoreActions } from '../../../store/storeTypes';
import { useConfig } from '../../../context/ConfigurationContext';

const SettingsPage: React.FC = () => {
    const history = useHistory();
    const logout = useStoreActions((store) => store.logout);
    const { revokeSessionsUsecase } = useConfig();

    const handleDisconnect = async (): Promise<void> => {
        await revokeSessionsUsecase.execute();
        logout();
    };

    return (
        <IonPage>
            <SettingsContent onBackPressed={history.goBack} onDisconnect={handleDisconnect} />
        </IonPage>
    );
};

export default SettingsPage;
