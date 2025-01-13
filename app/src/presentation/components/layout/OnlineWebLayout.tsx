import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import HomeHeader from '../HomeHeader';
import NewActivityMenuModal from '../modals/NewActivityMenuModal';
import NewLogEntryMenuModal from '../modals/NewLogEntryMenuModal';
import NewSessionMenuModal from '../modals/NewSessionMenuModal';
import NewVocabularyMenuModal from '../modals/NewVocabularyMenuModal';
import ReportModal from '../modals/ReportModal';
import styles from './OnlineWebLayout.module.css';
import Sidebar from './Sidebar';
interface OnlineLayoutProps {
    children: React.ReactNode;
    onRefresh?: () => void;
}

const OnlineWebLayout: React.FC<OnlineLayoutProps> = ({ children, onRefresh }) => {
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const [displayVocabularySidebar, setDisplayVocabularySidebar] = useState<boolean>(false);
    const [displayActivitySidebar, setDisplayActivitySidebar] = useState<boolean>(false);
    const [displayLearningDiary, setDisplayLearningDiary] = useState<boolean>(false);
    const [displaySessionModal, setDisplaySessionModal] = useState<boolean>(false);
    return (
        <IonPage>
            <HomeHeader />
            <div className={styles.container}>
                <Sidebar
                    onDisplayReport={() => setDisplayReport(true)}
                    onDisplayVocabularySidebar={() => setDisplayVocabularySidebar(true)}
                    onDisplayActivitySidebar={() => setDisplayActivitySidebar(true)}
                    onDisplayLearningDiary={() => setDisplayLearningDiary(true)}
                    onOpenActivitySidebar={() => setDisplayActivitySidebar(true)}
                    onDisplaySessionModal={() => setDisplaySessionModal(true)}
                />
                <IonContent className={styles.content}>{children}</IonContent>
            </div>
            <ReportModal isVisible={displayReport} onClose={() => setDisplayReport(false)} />
            <NewVocabularyMenuModal
                isVisible={displayVocabularySidebar}
                onClose={() => setDisplayVocabularySidebar(false)}
            />
            <NewActivityMenuModal isVisible={displayActivitySidebar} onClose={() => setDisplayActivitySidebar(false)} />
            <NewSessionMenuModal
                isVisible={displaySessionModal}
                onClose={() => setDisplaySessionModal(false)}
                setRefreshSessions={onRefresh}
            />
            <NewLogEntryMenuModal isVisible={displayLearningDiary} onClose={() => setDisplayLearningDiary(false)} />
        </IonPage>
    );
};

export default OnlineWebLayout;
