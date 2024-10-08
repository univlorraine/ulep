import { IonButton, IonIcon, IonImg, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg, LeftChevronSvg } from '../../../assets';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import SelectTandemModal from '../modals/SelectTandemModal';
import SessionList from '../sessions/SessionList';
import styles from './SessionListContent.module.css';

interface SessionListContentProps {
    goBack?: () => void;
    isHybrid: boolean;
    tandems: Tandem[];
    sessions: Session[];
    onCreateSessionPressed: (tandem: Tandem) => void;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
}

const Content: React.FC<SessionListContentProps> = ({
    goBack,
    tandems,
    sessions,
    isHybrid,
    onCreateSessionPressed,
    onShowSessionPressed,
    onUpdateSessionPressed,
}) => {
    const { t } = useTranslation();
    const [showSelectTandemModal, setShowSelectTandemModal] = useState(false);
    const onAddSession = () => {
        setShowSelectTandemModal(true);
    };

    const onSelectTandem = (tandem: Tandem) => {
        onCreateSessionPressed(tandem);
        setShowSelectTandemModal(false);
    };

    return (
        <div className={`${styles.container} subcontent-container content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('chat.conversation_menu.return_to_conversations_aria_label') as string}
                        className={styles.back_button}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>{t('session.list.title', { count: sessions.length })}</h2>
            </div>
            <SessionList
                tandems={tandems}
                sessions={sessions}
                isHybrid={isHybrid}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
                onCreateSessionPressed={onCreateSessionPressed}
            />
            <IonButton fill="clear" className="add-button" onClick={() => onAddSession()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
            <SelectTandemModal
                isVisible={showSelectTandemModal}
                onClose={() => setShowSelectTandemModal(false)}
                onSelectTandem={onSelectTandem}
                tandems={tandems}
            />
        </div>
    );
};

const SessionListContent: React.FC<SessionListContentProps> = ({
    isHybrid,
    goBack,
    tandems,
    sessions,
    onCreateSessionPressed,
    onShowSessionPressed,
    onUpdateSessionPressed,
}) => {
    if (!isHybrid) {
        return (
            <Content
                goBack={goBack}
                isHybrid={isHybrid}
                tandems={tandems}
                sessions={sessions}
                onCreateSessionPressed={onCreateSessionPressed}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        );
    }

    return (
        <IonPage className={styles.content}>
            <Content
                goBack={goBack}
                isHybrid={isHybrid}
                tandems={tandems}
                sessions={sessions}
                onCreateSessionPressed={onCreateSessionPressed}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        </IonPage>
    );
};

export default SessionListContent;
