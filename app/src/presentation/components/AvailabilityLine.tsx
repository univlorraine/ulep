import { useTranslation } from 'react-i18next';
import styles from './AvailabilityLine.module.css';

interface AvailabilityLineProps {
    availability: AvailabilitiesOptions;
    day: string;
    onPress?: ({ id, occurence }: { id: string; occurence: AvailabilitiesOptions }) => void;
}

interface AvailabilityTextProps {
    day: string;
    availability: AvailabilitiesOptions;
    className?: string;
}

const getColor = (availability: AvailabilitiesOptions) => {
    switch (availability) {
        case 'AVAILABLE':
            return '#FF8700';
        case 'UNAVAILABLE':
            return '#F60C36';
        default:
            return '#00FF47';
    }
};

export const AvailabilityText: React.FC<AvailabilityTextProps> = ({ day, availability, className }) => {
    const { t } = useTranslation();
    return (
        <div className={`${styles['availability-text']} ${className}`}>
            <span
                className={styles['availability-day']}
                style={{ color: availability === 'UNAVAILABLE' ? '#767676' : 'black' }}
            >
                {t(`days.${day}`)}
            </span>
            <div style={{ backgroundColor: getColor(availability) }} className={styles.dot} />
        </div>
    );
};

const AvailabilityLine: React.FC<AvailabilityLineProps> = ({ availability, day, onPress }) => {
    const { t } = useTranslation();

    return (
        <button
            key={day}
            className={styles.container}
            disabled={!onPress}
            onClick={() => (onPress ? onPress({ id: day, occurence: availability }) : null)}
            aria-label={t(`days.${day}`) as string}
        >
            <span
                className={styles['availability-day']}
                style={{ color: availability === 'UNAVAILABLE' ? '#767676' : 'black' }}
            >
                {t(`days.${day}`)}
            </span>
            <div className={styles['availability-container']}>
                <div style={{ backgroundColor: getColor(availability) }} className={styles.dot} />
                <span
                    className={styles['availability-status']}
                    style={{ color: availability === 'UNAVAILABLE' ? '#767676' : 'black' }}
                >
                    {t(`signup_availabilities_page.${availability}`)}
                </span>
            </div>
        </button>
    );
};

export default AvailabilityLine;
