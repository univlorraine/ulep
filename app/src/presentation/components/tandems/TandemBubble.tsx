import Language from '../../../domain/entities/Language';
import styles from './TandemBubble.module.css';

interface TandemBubbleProps {
    language: Language;
    profileAvatar?: string;
    profileName?: string;
}

const TandemBubble: React.FC<TandemBubbleProps> = ({ language, profileAvatar, profileName }) => {
    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <img alt="tandem-avatar" className={styles.avatar} src={profileAvatar} />
                <span className={styles.name}>{profileName}</span>
            </div>
            <div className={styles['flag-container']}>
                <span className={styles.flag}>{language.getFlag()}</span>
            </div>
        </div>
    );
};

export default TandemBubble;
