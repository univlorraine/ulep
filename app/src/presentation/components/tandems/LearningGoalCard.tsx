import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import LearningCard from '../card/LearningCard';
import styles from './LearningGoalCard.module.css';
import Profile from '../../../domain/entities/Profile';
import Goal from '../../../domain/entities/Goal';
import { WritingSkillPng } from '../../../assets';
import NetworkImage from '../NetworkImage';
import { IonButton } from '@ionic/react';

interface LearningGoalCardProps {
    profile: Profile;
    onShowAllGoalsPressed: () => void;
}

const LearningGoalCard: React.FC<LearningGoalCardProps> = ({ profile, onShowAllGoalsPressed }) => {
    const { t } = useTranslation();

    return (
        <LearningCard title={t('learning_goal.title', { count: profile.goals.length })}>
            <div className={styles.container}>
                <ul className={styles.content}>
                    {profile.goals.map((goal: Goal) => (
                        <li key={goal.id} className={styles.goalItem}>
                            <div className={styles.imageContainer}>
                                <NetworkImage
                                    id={goal.image?.id ?? ''}
                                    alt={goal.name}
                                    className={styles.image}
                                    placeholder={WritingSkillPng}
                                    aria-hidden={true}
                                />
                            </div>
                            <p className={styles.goalName}>{goal.name}</p>
                        </li>
                    ))}
                </ul>
                <div className={styles.buttons}>
                    <IonButton fill="clear" className="primary-button no-padding" onClick={onShowAllGoalsPressed}>
                        {t('learning_goal.button')}
                    </IonButton>
                </div>
            </div>
        </LearningCard>
    );
};

export default LearningGoalCard;
