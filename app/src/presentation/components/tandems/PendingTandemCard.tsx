import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import LearningCard from '../card/LearningCard';
import styles from './PendingTandemCard.module.css';
import TandemLine from './TandemLine';

interface PendingTandemCardProps {
    tandem: Tandem;
    onTandemPressed: () => void;
    currentColor?: string;
}

const PendingTandemCard: React.FC<PendingTandemCardProps> = ({ tandem, onTandemPressed, currentColor }) => {
    const { t } = useTranslation();
    return (
        <LearningCard title={t('learning.card.pending_tandem')}>
            <div className={styles.content} style={{ backgroundColor: currentColor }}>
                <TandemLine
                    language={tandem.learningLanguage}
                    onPressed={onTandemPressed}
                    status={tandem.status}
                    currentColor={currentColor}
                    profile={tandem.partner}
                />
            </div>
        </LearningCard>
    );
};

export default PendingTandemCard;
