import { IonPage } from '@ionic/react';
import { useState } from 'react';
import { Redirect } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import ProfileContent from '../components/contents/ProfileContent';
import SettingsContent from '../components/contents/SettingsContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import SettingsModal from '../components/modals/SettingsModal';
import useLogout from '../hooks/useLogout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const ProfilePage: React.FC = () => {
    const profile = useStoreState((state) => state.profile);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [displaySettings, setDisplaySettings] = useState<boolean>(false);
    const { handleLogout } = useLogout();

    if (!profile) {
        return <Redirect to={'/signup'} />;
    }

    if (isHybrid) {
        return (
            <IonPage>
                {displaySettings ? (
                    <SettingsContent
                        onBackPressed={() => setDisplaySettings(false)}
                        onDisconnect={handleLogout}
                        onLanguageChange={() => {}}
                    />
                ) : (
                    <ProfileContent
                        onDisplaySettings={() => setDisplaySettings(true)}
                        profile={profile}
                        onProfileChange={() => {}}
                    />
                )}
            </IonPage>
        );
    }

    return (
        <>
            <OnlineWebLayout>
                <ProfileContent
                    onDisplaySettings={() => setDisplaySettings(true)}
                    profile={profile}
                    onProfileChange={() => {}}
                />
            </OnlineWebLayout>
            <SettingsModal
                isVisible={displaySettings}
                onClose={() => setDisplaySettings(false)}
                onDisconnect={handleLogout}
                onLanguageChange={() => {}}
            />
        </>
    );
};

export default ProfilePage;
