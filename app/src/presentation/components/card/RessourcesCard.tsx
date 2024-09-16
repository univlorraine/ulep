import { useTranslation } from 'react-i18next';
import { DiceSvg, FicheSvg, JournalSvg, VocabularySvg } from '../../../assets';
import LearningCard from './LearningCard';
import styles from './RessourcesCard.module.css';

interface RessourcesCardProps {
    onLearningJournalPressed: () => void;
    onVocabularyPressed: () => void;
    onActivityPressed: () => void;
    onGamePressed: () => void;
}

const RessourcesCard: React.FC<RessourcesCardProps> = ({
    onLearningJournalPressed,
    onVocabularyPressed,
    onActivityPressed,
    onGamePressed,
}) => {
    const { t } = useTranslation();

    return (
        <LearningCard title={t('ressources.title')}>
            <div className={styles.container}>
                <button className={styles.card} onClick={onLearningJournalPressed}>
                    <img src={JournalSvg} alt="" />
                    <p className={styles.title}>{t('ressources.journal')}</p>
                </button>
                <button className={styles.card} onClick={onVocabularyPressed}>
                    <img src={VocabularySvg} alt="" />
                    <p className={styles.title}>{t('ressources.vocabulary')}</p>
                </button>
                <button className={styles.card} onClick={onActivityPressed}>
                    <img src={FicheSvg} alt="" />
                    <p className={styles.title}>{t('ressources.activity')}</p>
                </button>
                <button className={styles.card} onClick={onGamePressed}>
                    <img src={DiceSvg} alt="" />
                    <p className={styles.title}>{t('ressources.game')}</p>
                </button>
            </div>
        </LearningCard>
    );
};

export default RessourcesCard;
