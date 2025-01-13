import { useTranslation } from 'react-i18next';
import { DicesPng, FicheSvg, JournalSvg, VocabularyPng } from '../../../assets';
import LearningCard from './LearningCard';
import styles from './RessourcesCard.module.css';

interface RessourcesCardProps {
    onLearningBookPressed: () => void;
    onVocabularyPressed: () => void;
    onActivityPressed: () => void;
    onGamePressed: () => void;
}

const RessourcesCard: React.FC<RessourcesCardProps> = ({
    onLearningBookPressed,
    onVocabularyPressed,
    onActivityPressed,
    onGamePressed,
}) => {
    const { t } = useTranslation();

    return (
        <LearningCard title={t('ressources.title')}>
            <div className={styles.container}>
                <button className={styles.card} onClick={onLearningBookPressed}>
                    <img src={JournalSvg} alt="" />
                    <p className={styles.title}>{t('ressources.journal')}</p>
                </button>
                <button className={styles.card} onClick={onVocabularyPressed}>
                    <img src={VocabularyPng} alt="" />
                    <p className={styles.title}>{t('ressources.vocabulary')}</p>
                </button>
                <button className={styles.card} onClick={onActivityPressed}>
                    <img src={FicheSvg} alt="" />
                    <p className={styles.title}>{t('ressources.activity')}</p>
                </button>
                <button className={styles.card} onClick={onGamePressed}>
                    <img src={DicesPng} alt="" />
                    <p className={styles.title}>{t('ressources.game')}</p>
                </button>
            </div>
        </LearningCard>
    );
};

export default RessourcesCard;
