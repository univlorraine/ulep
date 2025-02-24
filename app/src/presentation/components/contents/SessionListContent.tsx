import { IonButton, IonImg, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../assets';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import HeaderSubContent from '../HeaderSubContent';
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
        if (tandems.length === 1) {
            onCreateSessionPressed(tandems[0]);
        } else {
            setShowSelectTandemModal(true);
        }
    };

    const onSelectTandem = (tandems: Tandem[]) => {
        onCreateSessionPressed(tandems[0]);
        setShowSelectTandemModal(false);
    };

    return (
        <div className={styles.container}>
            <HeaderSubContent
                title={t('session.list.title', { count: sessions.length })}
                onBackPressed={() => goBack?.()}
            />
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
                title="session.select_partner_title"
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
