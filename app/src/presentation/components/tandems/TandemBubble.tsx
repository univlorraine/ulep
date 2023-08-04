import Language from '../../../domain/entities/Language';
import styles from './TandemBubble.module.css';

interface TandemBubbleProps {
    language: Language;
    onTandemPressed: () => void;
    profileAvatar?: string;
    profileName?: string;
}

const TandemBubble: React.FC<TandemBubbleProps> = ({ language, onTandemPressed, profileAvatar, profileName }) => {
    return (
        <button className={styles.container} onClick={onTandemPressed}>
            <div className={styles.profile}>
                <img alt="tandem-avatar" className={styles.avatar} src={profileAvatar} />
                <span className={styles.name}>{profileName}</span>
            </div>
            <div className={styles['flag-container']}>
                <span className={styles.flag}>{language.getFlag()}</span>
            </div>
        </button>
    );
};

export default TandemBubble;
