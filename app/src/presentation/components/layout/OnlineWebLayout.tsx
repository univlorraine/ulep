import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import HomeHeader from '../HomeHeader';
import ReportModal from '../modals/ReportModal';
import styles from './OnlineWebLayout.module.css';
import Sidebar from './Sidebar';

interface OnlineLayoutProps {
    children: React.ReactNode;
    onRefresh?: () => void;
}

const OnlineWebLayout: React.FC<OnlineLayoutProps> = ({ children }) => {
    const [displayReport, setDisplayReport] = useState<boolean>(false);

    return (
        <IonPage>
            <HomeHeader />
            <div className={styles.container}>
                <Sidebar onDisplayReport={() => setDisplayReport(true)} />
                <IonContent className={styles.content}>{children}</IonContent>
            </div>
            <ReportModal isVisible={displayReport} onClose={() => setDisplayReport(false)} />
        </IonPage>
    );
};

export default OnlineWebLayout;
