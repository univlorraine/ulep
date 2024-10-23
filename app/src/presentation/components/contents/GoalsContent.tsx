import Profile from '../../../domain/entities/Profile';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import styles from './GoalsContent.module.css';
import Goal from '../../../domain/entities/Goal';
import NetworkImage from '../NetworkImage';
import { AddSvg, ArrowRightSvg, LeftChevronSvg, WritingSkillPng } from '../../../assets';
import { IonButton, IonIcon, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
interface GoalsContentProps {
    profile: Profile;
    learningLanguage?: LearningLanguage;
    customLearningGoals?: CustomLearningGoal[];
    goBack?: () => void;
    onAddCustomGoalPressed: () => void;
    onShowCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
}

const GoalsContent = ({
    profile,
    goBack,
    learningLanguage,
    customLearningGoals,
    onAddCustomGoalPressed,
    onShowCustomGoalPressed,
}: GoalsContentProps) => {
    const { t } = useTranslation();
    const customGoals: CustomLearningGoal[] = customLearningGoals ?? learningLanguage?.customLearningGoals ?? [];
    const customGoalsCount: number = customGoals.length;

    return (
        <div className={`${styles.container} subcontent-container content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('goals.list.return_to_learning_aria_label') as string}
                        className={styles.back_button}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>{t('goals.list.title')}</h2>
            </div>
            <ul className={styles.content} role="list">
                {profile.goals.map((goal: Goal) => (
                    <li key={goal.id} className={styles.goalItem} role="listitem">
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
                {customGoals.map((goal: CustomLearningGoal) => (
                    <li key={goal.id} role="listitem" className={styles.goalItem}>
                        <button
                            className={styles.customGoalButton}
                            onClick={() => onShowCustomGoalPressed(goal)}
                        >
                            <div className={styles.goalTitleContainer}>
                                <h3 className={styles.goalTitle}>{goal.title}</h3>
                                <IonIcon icon={ArrowRightSvg} />
                            </div>
                            <p className={styles.goalDescription}>{goal.description}</p>
                        </button>
                    </li>
                ))}
            </ul>
            {customGoalsCount < 3 && (
                <IonButton fill="clear" className="add-button" onClick={onAddCustomGoalPressed}>
                    <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
                </IonButton>
            )}
        </div>
    )
}

export default GoalsContent;
