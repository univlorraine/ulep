import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import Profile from '../../../domain/entities/Profile';
import useLogout from '../../hooks/useLogout';
import HomeHeader from '../HomeHeader';
import ProfileModal from '../modals/ProfileModal';
import ReportModal from '../modals/ReportModal';
import SettingsModal from '../modals/SettingsModal';
import styles from './OnlineWebLayout.module.css';
import Sidebar from './Sidebar';

interface OnlineLayoutProps {
    profile: Profile;
    children: React.ReactNode;
    onRefresh?: () => void;
}

const OnlineWebLayout: React.FC<OnlineLayoutProps> = ({ children, profile, onRefresh }) => {
    const [displayProfile, setDisplayProfile] = useState<boolean>(false);
    const [displaySettings, setDisplaySettings] = useState<boolean>(false);
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const { handleLogout } = useLogout();

    return (
        <IonPage>
            <HomeHeader />
            <div className={styles.container}>
                <Sidebar
                    onDisconnect={handleLogout}
                    onDisplaySettings={() => setDisplaySettings(true)}
                    onDisplayReport={() => setDisplayReport(true)}
                    onDisplayProfile={() => setDisplayProfile(true)}
                />
                <IonContent className={styles.content}>{children}</IonContent>
            </div>
            <ProfileModal
                isVisible={displayProfile}
                onClose={() => setDisplayProfile(false)}
                onDisconnect={handleLogout}
                onLanguageChange={onRefresh}
                profile={profile!}
            />
            <SettingsModal
                isVisible={displaySettings}
                onClose={() => setDisplaySettings(false)}
                onDisconnect={handleLogout}
                onLanguageChange={onRefresh}
            />
            <ReportModal isVisible={displayReport} onClose={() => setDisplayReport(false)} />
        </IonPage>
    );
};

export default OnlineWebLayout;
