import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { TrophiePng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Tandem from '../../../domain/entities/Tandem';
import useGetMediaObject from '../../hooks/useGetMediaObject';
import useOnOpenChat from '../../hooks/useOnOpenChat';
import LearningCard from '../card/LearningCard';
import styles from './LearningJournalCard.module.css';

interface LearningJournalCardProps {
    tandem: Tandem;
    onOpenEdito: () => void;
}

const LearningJournalCard: React.FC<LearningJournalCardProps> = ({ tandem, onOpenEdito }) => {
    const { t } = useTranslation();
    const { fileAdapter } = useConfig();
    const onOpenChat = useOnOpenChat({ tandemId: tandem.id, withAdministrator: true });
    const {
        loading: loadingCertificate,
        image: certificateFile,
        error: certificateError,
    } = useGetMediaObject({ id: tandem.learningLanguage.certificateFile?.id || '' });

    const downloadableCertificate =
        tandem.learningLanguage.sharedCertificate &&
        tandem.learningLanguage.certificateFile &&
        !loadingCertificate &&
        !certificateError;

    const onDownloadCertificate = () => {
        if (downloadableCertificate) {
            const certificateFileName: string = [
                t('learning_journal.certificate_file_name'),
                t(`languages_code.${tandem.learningLanguage.code}`),
                `${tandem.learningLanguage.profile?.user.firstname} ${tandem.learningLanguage.profile?.user.lastname}`,
            ].join(' - ');
            fileAdapter.saveFile(certificateFile, certificateFileName);
        }
    };

    return (
        <LearningCard title={t('learning_journal.title')}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        <img alt="" className={styles.image} src={TrophiePng} aria-hidden={true} />
                    </div>
                    <div className={styles.textContainer}>
                        <h2 className={styles.title}>{t('learning_journal.certificate_title')}</h2>
                        <p className={styles.text}>{t('learning_journal.certificate_text')}</p>
                    </div>
                </div>
                <ul className={styles.activities}>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.sessions_duration_title')}</h3>
                        <span className={styles.activityValue}>{tandem.learningLanguage.visioDuration}</span>
                    </li>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.vocabulary_title')}</h3>
                        <span className={styles.activityValue}>{tandem.learningLanguage.countVocabularies}</span>
                    </li>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.activities_title')}</h3>
                        <span className={styles.activityValue}>{tandem.learningLanguage.countActivities}</span>
                    </li>
                </ul>
                <div className={styles.buttons}>
                    {downloadableCertificate ? (
                        <IonButton fill="clear" className="primary-button no-padding" onClick={onDownloadCertificate}>
                            {t('learning_journal.download_certificate_button')}
                        </IonButton>
                    ) : (
                        <IonButton fill="clear" className="primary-button no-padding" onClick={onOpenChat}>
                            {t('learning_journal.ask_for_certificate_button')}
                        </IonButton>
                    )}
                    <IonButton
                        fill="clear"
                        className={`secondary-button no-padding ${styles.link}`}
                        onClick={onOpenEdito}
                    >
                        {t('learning_journal.how_to_get_certificate_button')}
                    </IonButton>
                </div>
            </div>
        </LearningCard>
    );
};

export default LearningJournalCard;
