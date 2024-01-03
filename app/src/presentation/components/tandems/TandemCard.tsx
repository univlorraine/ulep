import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { codeLanguageToFlag } from '../../utils';
import Avatar from '../Avatar';
import styles from './TandemCard.module.css';

interface TandemCardProps {
    profile: Profile;
    language: Language;
}

const TandemCard: React.FC<TandemCardProps> = ({ profile, language }) => {
    return (
        <div className={styles['container']}>
            <div className={styles.card2} />
            <div className={styles.card1} />
            <div className={styles.card}>
                <div className={styles.content}>
                    <Avatar user={profile.user} className={styles.avatar} />
                    <div className={styles.bubble}>{codeLanguageToFlag(language.code)}</div>
                    <div className={styles['text-container']}>
                        <span className={styles.name}>{`${profile.user.firstname} ${profile.user.lastname}`}</span>
                        <span className={styles['university-name']}>{profile.user.university.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TandemCard;
