import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import ProfileAvailabilities from '../sessions/ProfileAvailabilities';
import SessionForm from '../sessions/SessionForm';
import styles from './SessIonFormContent.module.css';

interface SessionFormContentProps {
    goBack?: () => void;
    isHybrid: boolean;
    profile: Profile;
    tandem: Tandem;
    session?: Session;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
}

export interface SessionFormData {
    id?: string;
    date: Date;
    comment: string;
}

const Content: React.FC<SessionFormContentProps> = ({
    goBack,
    tandem,
    session,
    profile,
    onShowSessionPressed,
}) => {
    const { t } = useTranslation();
    const { createSession, updateSession } = useConfig();

    const handleSubmit = async ({ id, date, comment }: SessionFormData) => {
        if (id) {
            const session = await updateSession.execute({
                id,
                startAt: date,
                comment,
            });

            if (session instanceof Error) {
                return;
            }

            onShowSessionPressed(session, tandem);
        } else {
            const session = await createSession.execute({
                startAt: date,
                comment,
                tandemId: tandem.id,
            });

            if (session instanceof Error) {
                return;
            }

            onShowSessionPressed(session, tandem, true);
        }
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
                <h2 className={styles.title}>{t(session ? 'session.form.update_title' : 'session.form.create_title', { name: tandem?.partner?.user?.firstname })}</h2>
            </div>
            <div className={styles.content}>
                <ProfileAvailabilities partner={tandem.partner} />
                <SessionForm onSubmit={handleSubmit} onBackPressed={goBack} session={session} profile={profile} partner={tandem.partner} />
            </div>
        </div>
    );
};

const SessionFormContent: React.FC<SessionFormContentProps> = ({
    isHybrid,
    goBack,
    profile,
    tandem,
    session,
    onShowSessionPressed,
}) => {
    if (!isHybrid) {
        return (
            <Content
                goBack={goBack}
                isHybrid={isHybrid}
                profile={profile}
                tandem={tandem}
                session={session}
                onShowSessionPressed={onShowSessionPressed}
            />
        );  
    }

    return (
        <IonPage className={styles.content}>
            <Content
                goBack={goBack}
                isHybrid={isHybrid}
                profile={profile}
                tandem={tandem}
                session={session}
                onShowSessionPressed={onShowSessionPressed}
            />
        </IonPage>
    );
};

export default SessionFormContent;
