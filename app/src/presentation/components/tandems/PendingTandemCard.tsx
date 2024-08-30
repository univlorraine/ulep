import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import styles from './PendingTandemCard.module.css';
import TandemLine from './TandemLine';

interface PendingTandemCardProps {
    tandem: Tandem;
    onTandemPressed: () => void;
}

const PendingTandemCard: React.FC<PendingTandemCardProps> = ({ tandem, onTandemPressed }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <p className="home-card-title">{t('learning.card.pending_tandem')}</p>
            <div className={styles.content}>
                <TandemLine language={tandem.learningLanguage} onPressed={onTandemPressed} status={tandem.status} />
            </div>
        </div>
    );
};

export default PendingTandemCard;
