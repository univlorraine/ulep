import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import SessionCard from './SessionCard';
import styles from './SessionListHome.module.css';

interface SessionListHomeProps {
    tandems: Tandem[];
    sessions: Session[];
    isHybrid: boolean;
    onShowSessionListPressed: () => void;
    onShowSessionPressed: (session: Session, tandem: Tandem) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onCreateSessionPressed: (tandem: Tandem) => void;
}

const SessionListHome: React.FC<SessionListHomeProps> = ({
    tandems,
    sessions,
    isHybrid,
    onShowSessionPressed,
    onUpdateSessionPressed,
    onCreateSessionPressed,
    onShowSessionListPressed,
}) => {
    const { t } = useTranslation();

    const handleShowSessionList = () => {
        onShowSessionListPressed();
    };

    const tandemsWithoutSession = tandems.filter((tandem) => 
        tandem.status === 'ACTIVE' &&
        !sessions.some((session) => session.tandemId === tandem.id
    ));
    
    const countTandems = tandemsWithoutSession.length;
    const countSessionsToDisplay = 3 - countTandems;

    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.session.title', { count: sessions.length })}</span>
            <div className={styles.container}>
                <div className={styles['session-container']}>
                    {tandemsWithoutSession.map((tandem) => {
                        return (
                            <SessionCard
                                key={tandem.id}
                                tandem={tandem}
                                isHybrid={isHybrid}
                                onShowSessionPressed={onShowSessionPressed}
                                onUpdateSessionPressed={onUpdateSessionPressed}
                                onCreateSessionPressed={onCreateSessionPressed}
                            />
                        );
                    })}
                    {countSessionsToDisplay > 0 && sessions.slice(0, countSessionsToDisplay).map((session) => {
                        const tandem = tandems.find((tandem) => tandem.id === session.tandemId);
                        if (!tandem) return null;
                        return (
                            <SessionCard
                                key={session.id}
                                tandem={tandem}
                                session={session}
                                isHybrid={isHybrid}
                                onShowSessionPressed={onShowSessionPressed}
                                onUpdateSessionPressed={onUpdateSessionPressed}
                                onCreateSessionPressed={onCreateSessionPressed}
                            />
                        );
                    })}
                </div>
                {sessions.length > 0 && (
                    <IonButton className="primary-button no-padding" fill="clear" onClick={handleShowSessionList}>
                        {t('home_page.session.show_session_list_button')}
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default SessionListHome;
