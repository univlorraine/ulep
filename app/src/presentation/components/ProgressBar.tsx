import { useTranslation } from 'react-i18next';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    color: string;
    percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ color, percentage }) => {
    const { t } = useTranslation();
    return (
        <div
            className={styles['main-bar']}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('grobal.signup-progress-bar-label') as string}
        >
            <div className={styles['color-bar']} style={{ backgroundColor: color, width: `${percentage}%` }} />
        </div>
    );
};

export default ProgressBar;
