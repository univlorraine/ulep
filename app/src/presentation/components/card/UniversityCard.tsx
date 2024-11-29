import { IonButton } from '@ionic/react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import NetworkImage from '../NetworkImage';
import styles from './UniversityCard.module.css';

interface UniversityCardProps {
    university: University;
    onPress: () => void;
    currentColor?: string;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university, onPress, currentColor }) => {
    const { t } = useTranslation();
    const formattedAdmissionStart = format(new Date(university.admissionStart), 'dd/MM/yyyy');
    const formattedAdmissionEnd = format(new Date(university.admissionEnd), 'dd/MM/yyyy');
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <div
            className={`${styles.card} ${university.isCentral ? styles.central : styles.partner}`}
            style={{ backgroundColor: currentColor }}
        >
            <div className={`${styles.container}`}>
                {university.logo ? (
                    <NetworkImage
                        id={university.logo}
                        alt=""
                        role="presentation"
                        className={styles.logo}
                        aria-hidden={true}
                    />
                ) : (
                    <div className={styles.logo} aria-hidden={true} />
                )}
                <div className={styles['text-container']}>
                    <span className={styles.title}>{university.name}</span>
                    <br />
                    <span className={styles.subtitle}>{t('university_card.period')}</span>
                    <br />
                    <span className={styles.subtitle}>{`${formattedAdmissionStart} - ${formattedAdmissionEnd}`}</span>
                </div>
            </div>
            {isHybrid && (
                <IonButton className={`primary-button`} fill="clear" onClick={onPress}>
                    {t('university_card.button')}
                </IonButton>
            )}
        </div>
    );
};

export default UniversityCard;
