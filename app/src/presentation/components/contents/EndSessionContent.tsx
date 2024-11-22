import { IonButton, useIonToast } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarPng } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import { LogEntryType } from '../../../domain/entities/LogEntry';
import styles from './EndSessionContent.module.css';

type EndSessionContentProps = {
    onClose: () => void;
    onCompleteLearningJournalPressed: () => void;
    duration?: number;
    partnerTandemId?: string;
    tandemFirstname?: string;
    tandemLastname?: string;
};

const EndSessionContent: React.FC<EndSessionContentProps> = ({
    onClose,
    onCompleteLearningJournalPressed,
    duration,
    partnerTandemId,
    tandemFirstname,
    tandemLastname,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { createLogEntry } = useConfig();
    const { configuration } = useConfig();

    const handleCompleteLearningJournalPressed = async () => {
        if (duration && partnerTandemId && tandemFirstname && tandemLastname) {
            const result = await createLogEntry.execute({
                type: LogEntryType.VISIO,
                metadata: {
                    duration,
                    partnerTandemId,
                    tandemFirstname,
                    tandemLastname,
                },
            });

            if (result instanceof Error) {
                showToast({ message: t(result.message), duration: 5000 });
            }
        }

        onCompleteLearningJournalPressed();
    };

    return (
        <div className={styles.container}>
            <Background
                style={{ color: configuration.primaryBackgroundImageColor }}
                className={styles.background_image}
                aria-hidden={true}
            />
            <div className={styles.header}>
                <h1 className={styles.title}>{t('home_page.end_session.title')}</h1>
            </div>
            <div className={styles.star}>
                <img src={StarPng} alt="" aria-hidden />
            </div>
            <div className={styles.content}>
                <p className={styles.description}>{t('home_page.end_session.time_past')}</p>
                <p className={styles.description}>{t('home_page.end_session.complete_learning_journal')}</p>
            </div>
            <div className={styles.buttons}>
                <IonButton
                    fill="clear"
                    className="primary-button no-padding"
                    onClick={handleCompleteLearningJournalPressed}
                >
                    {t('home_page.end_session.complete_learning_journal_button')}
                </IonButton>
                <IonButton fill="clear" className="secondary-button no-padding" onClick={onClose}>
                    {t('home_page.end_session.close_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default EndSessionContent;
