import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import NetworkImage from '../NetworkImage';
import styles from './UniversityCard.module.css';

interface UniversityCardProps {
    university: University;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
    const { t } = useTranslation();
    const formattedAdmissionStart = format(new Date(university.admissionStart), 'dd/MM/yyyy');
    const formattedAdmissionEnd = format(new Date(university.admissionEnd), 'dd/MM/yyyy');
    return (
        <div className={`${styles.container} ${university.isCentral ? styles.central : styles.partner}`}>
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
                <span className={styles.subtitle}>{t('home_page.my_university.period')}</span>
                <br />
                <span className={styles.subtitle}>{`${formattedAdmissionStart} - ${formattedAdmissionEnd}`}</span>
            </div>
        </div>
    );
};

export default UniversityCard;
