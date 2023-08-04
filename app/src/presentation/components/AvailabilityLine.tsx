import { useTranslation } from 'react-i18next';
import Availability, { occurence } from '../../domain/entities/Availability';
import styles from './AvailabilityLine.module.css';

interface AvailabilityLineProps {
    availability: Availability;
    day: string;
    onPress?: ({ id, occurence }: { id: string; occurence: occurence }) => void;
}

const AvailabilityLine: React.FC<AvailabilityLineProps> = ({ availability, day, onPress }) => {
    const { t } = useTranslation();
    let color: string;
    const status = availability.occurence;

    switch (status) {
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
            onClick={() => (onPress ? onPress({ id: day, occurence: status }) : null)}
        >
            <span
                className={styles['availability-day']}
                style={{ color: status === 'UNAVAILABLE' ? '#767676' : 'black' }}
            >
                {t(`days.${day}`)}
            </span>
            <div className={styles['availability-container']}>
                <div style={{ backgroundColor: color }} className={styles.dot} />
                <span
                    className={styles['availability-status']}
                    style={{ color: status === 'UNAVAILABLE' ? '#767676' : 'black' }}
                >
                    {t(`signup_availabilities_page.${status}`)}
                </span>
            </div>
        </button>
    );
};

export default AvailabilityLine;
