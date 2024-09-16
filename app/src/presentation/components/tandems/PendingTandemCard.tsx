import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import LearningCard from '../card/LearningCard';
import styles from './PendingTandemCard.module.css';
import TandemLine from './TandemLine';

interface PendingTandemCardProps {
    tandem: Tandem;
    onTandemPressed: () => void;
}

const PendingTandemCard: React.FC<PendingTandemCardProps> = ({ tandem, onTandemPressed }) => {
    const { t } = useTranslation();
    return (
        <LearningCard title={t('learning.card.pending_tandem')}>
            <div className={styles.content}>
                <TandemLine language={tandem.learningLanguage} onPressed={onTandemPressed} status={tandem.status} />
            </div>
        </LearningCard>
    );
};

export default PendingTandemCard;
