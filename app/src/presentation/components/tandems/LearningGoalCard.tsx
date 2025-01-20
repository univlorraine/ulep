import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { WritingSkillPng } from '../../../assets';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import Goal from '../../../domain/entities/Goal';
import Profile from '../../../domain/entities/Profile';
import LearningCard from '../card/LearningCard';
import NetworkImage from '../NetworkImage';
import styles from './LearningGoalCard.module.css';

interface LearningGoalCardProps {
    profile: Profile;
    customLearningGoals?: CustomLearningGoal[];
    onShowAllGoalsPressed: () => void;
}

const LearningGoalCard: React.FC<LearningGoalCardProps> = ({ profile, customLearningGoals, onShowAllGoalsPressed }) => {
    const { t } = useTranslation();
    const goalsCount = profile.goals.length + (customLearningGoals?.length ?? 0);

    return (
        <LearningCard title={t('learning_goal.title', { count: goalsCount })}>
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
                            <p>{goal.name}</p>
                        </li>
                    ))}
                    {customLearningGoals?.map((customLearningGoal: CustomLearningGoal) => (
                        <li key={customLearningGoal.id} role="listitem" className={styles.goalItem}>
                            <div className={styles.customLearningGoalContainer}>
                                <h3 className={styles.goalTitle}>{customLearningGoal.title}</h3>
                                <p className={styles.goalDescription}>{customLearningGoal.description}</p>
                            </div>
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
