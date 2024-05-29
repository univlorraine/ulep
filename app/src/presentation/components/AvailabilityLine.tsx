import { useTranslation } from 'react-i18next';
import styles from './AvailabilityLine.module.css';

interface AvailabilityLineProps {
    availability: AvailabilitiesOptions;
    day: string;
    onPress?: ({ id, occurence }: { id: string; occurence: AvailabilitiesOptions }) => void;
}

const AvailabilityLine: React.FC<AvailabilityLineProps> = ({ availability, day, onPress }) => {
    const { t } = useTranslation();
    let color: string;

    switch (availability) {
        case 'AVAILABLE':
            color = '#FF8700';
            break;
        case 'UNAVAILABLE':
            color = '#F60C36';
            break;
        default:
            color = '#00FF47';
    }

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
                <div style={{ backgroundColor: color }} className={styles.dot} />
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
