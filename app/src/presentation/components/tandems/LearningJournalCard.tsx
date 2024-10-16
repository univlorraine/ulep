import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import LearningCard from '../card/LearningCard';
import styles from './LearningJournalCard.module.css';
import { TrophiePng } from '../../../assets';
import { IonButton } from '@ionic/react';
import useOnOpenChat from '../../hooks/useOnOpenChat';

interface LearningJournalCardProps {
    tandem: Tandem;
    onTandemPressed: () => void;
}

const LearningJournalCard: React.FC<LearningJournalCardProps> = ({ tandem, onTandemPressed }) => {
    const { t } = useTranslation();
    const onOpenChat = useOnOpenChat({ tandemId: tandem.id, withAdministrator: true });

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
                        <span className={styles.activityValue}>{50}</span>
                    </li>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.vocabulary_title')}</h3>
                        <span className={styles.activityValue}>{26}</span>
                    </li>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.activities_title')}</h3>
                        <span className={styles.activityValue}>{3}</span>
                    </li>
                </ul>
                <div className={styles.buttons}>
                    <IonButton fill="clear" className="primary-button no-padding" onClick={onOpenChat}>
                        {t('learning_journal.ask_for_certificate_button')}
                    </IonButton>
                    <IonButton fill="clear" className={`secondary-button no-padding ${styles.link}`}>
                        {t('learning_journal.how_to_get_certificate_button')}
                    </IonButton>
                </div>
            </div>
        </LearningCard>
    );
};

export default LearningJournalCard;
