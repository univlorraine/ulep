import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import Profile from '../../../domain/entities/Profile';
import useLogout from '../../hooks/useLogout';
import HomeHeader from '../HomeHeader';
import ProfileModal from '../modals/ProfileModal';
import styles from './OnlineWebLayout.module.css';
import Sidebar from './Sidebar';

interface OnlineLayoutProps {
    profile: Profile;
    children: React.ReactNode;
}

const OnlineWebLayout: React.FC<OnlineLayoutProps> = ({ children, profile }) => {
    const [displayProfile, setDisplayProfile] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const { handleLogout } = useLogout();

    const onProfilePressed = () => setDisplayProfile(true);

    return (
        <IonPage>
            <HomeHeader user={profile!.user} onPicturePressed={onProfilePressed} />
            <div className={styles.container}>
                <Sidebar />
                <IonContent className={styles.content}>{children}</IonContent>
            </div>
            <ProfileModal
                isVisible={displayProfile}
                onClose={() => setDisplayProfile(false)}
                onDisconnect={handleLogout}
                onLanguageChange={() => setRefresh(!refresh)}
                profile={profile!}
            />
        </IonPage>
    );
};

export default OnlineWebLayout;
