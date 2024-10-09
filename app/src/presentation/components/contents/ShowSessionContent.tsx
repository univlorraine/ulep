import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { CancelledPng, LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import DateFormatted from '../sessions/DateFormatted';
import styles from './ShowSessionContent.module.css';
import ConfirmCancelSessionModal from '../modals/ConfirmCancelSessionModal';
import { useState } from 'react';
import { ReactComponent as Background } from '../../../assets/background.svg';

interface ShowSessionContentProps {
    goBack?: () => void;
    profile: Profile;
    session: Session;
    tandem: Tandem;
    isHybrid?: boolean;
    confirmCreation: boolean;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
}

const Content: React.FC<ShowSessionContentProps> = ({
    goBack,
    profile,
    onUpdateSessionPressed,
    session,
    tandem,
    confirmCreation,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { cancelSession, configuration } = useConfig();
    const [isCancelSessionModalVisible, setIsCancelSessionModalVisible] = useState(false);
    const userTz = profile?.user?.university?.timezone;
    const partnerTz = tandem.partner?.user?.university?.timezone;
    const updateSession = () => onUpdateSessionPressed(session, tandem);
    
    const handleCancelSession = async (comment: string) => {
        await cancelSession.execute({
            id: session.id,
            comment: comment,
        });

        setIsCancelSessionModalVisible(false);
        goBack ? goBack() : history.push('/home');
    };

    if (!userTz || !partnerTz) {
        return <Redirect to="/home" />;
    }

    const isSessionCancelled = session.cancelledAt !== null;

    return (
        <div className={`${styles.container} subcontent-container content-wrapper`}>
            {confirmCreation ? (
                <div className={styles.confirm_header}>
                    <h1 className={styles.confirm_title}>{t('session.confirm_creation_title')}</h1>
                    <p className={styles.confirm_message}>{t('session.confirm_creation_message', { name: tandem.partner?.user?.firstname })}</p>
                </div>
            ) : (
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
                    <h1 className={styles.title}>{t('session.show_title', { name: tandem.partner?.user?.firstname })}</h1>
                </div>
            )}
            <div className={styles.show_session_content}>
                {isSessionCancelled ? (
                    <div className={styles.block_cancelled} style={{ backgroundColor: configuration.primaryColor }}>
                        <Background
                            style={{ color: configuration.primaryBackgroundImageColor }}
                            className={styles.background_image}
                            aria-hidden={true}
                        />
                        <div className={styles.cancelled_icon}><img src={CancelledPng} alt="" aria-hidden="true" /></div>
                        <h3 className={styles.cancelled_title}>{t('session.cancel_title')}</h3>
                    </div>
                ) : (
                    <div className={styles.block}>
                        <h3 className={styles.block_title}>{t('session.date_and_hour')}</h3>
                        <div className={styles.line}>
                            <div className={styles.icon}>📅</div>
                            <p className={styles.line_content}>
                                <DateFormatted date={session.startAt} />
                            </p>
                        </div>
                        <div className={styles.line}>
                            <div className={styles.icon}>⏰</div>
                            <div className={styles.line_content}>
                                <p>{formatInTimeZone(session.startAt, profile?.user?.university.timezone as string, 'HH:mm (zzzz, zzz)')}</p>
                                {userTz !== partnerTz && (
                                    <p className={styles.datetimeInfo}>
                                        {t('session.time_for_partner', { name: tandem.partner?.user?.firstname})}
                                        <strong> {formatInTimeZone(session.startAt, partnerTz, 'HH:mm')} </strong>
                                        ({formatInTimeZone(session.startAt, partnerTz, 'zzzz, zzz')})
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {session.comment && (
                    <div className={styles.block}>
                        <h3 className={styles.block_title}>{t('session.comment')}</h3>
                    <div className={styles.line}>
                        <div className={styles.icon}>💬</div>
                        <div className={styles.line_content}>
                                <p>{session.comment}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.buttons}>
                {confirmCreation || isSessionCancelled ? (
                    <IonButton fill="clear" className="primary-button" onClick={goBack}>
                        {t('session.close_modal')}
                    </IonButton>
                ) : (
                    <>
                        <IonButton fill="clear" className="primary-button" onClick={updateSession}>
                            {t('session.update_session_btn')}
                        </IonButton>
                        <IonButton fill="clear" className="secondary-button" onClick={() => setIsCancelSessionModalVisible(true)}>
                            {t('session.cancel_session_btn')}
                        </IonButton>
                    </>
                )}
            </div>
            <ConfirmCancelSessionModal
                isVisible={isCancelSessionModalVisible}
                onClose={() => setIsCancelSessionModalVisible(false)}
                onCancelSession={handleCancelSession}
            />
        </div>
    );
};

const ShowSessionContent: React.FC<ShowSessionContentProps> = ({
    isHybrid,
    goBack,
    profile,
    session,
    tandem,
    confirmCreation,
    onUpdateSessionPressed,
}) => {
    if (!isHybrid) {
        return (
            <Content
                goBack={goBack}
                profile={profile}
                session={session}
                tandem={tandem}
                confirmCreation={confirmCreation}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        );
    }

    return (
        <IonPage className={styles.content}>
            <Content
                goBack={goBack}
                profile={profile}
                session={session}
                tandem={tandem}
                confirmCreation={confirmCreation}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        </IonPage>
    );
};

export default ShowSessionContent;
