import Profile from '../../../domain/entities/Profile';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import styles from './GoalsContent.module.css';
import Goal from '../../../domain/entities/Goal';
import NetworkImage from '../NetworkImage';
import { WritingSkillPng } from '../../../assets';

interface GoalsContentProps {
    profile: Profile;
    learningLanguage: LearningLanguage;
}

const GoalsContent = ({ profile, learningLanguage }: GoalsContentProps) => {

    return (
        <div>
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
        </div>
    )
}

export default GoalsContent;
