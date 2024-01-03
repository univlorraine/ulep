import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { codeLanguageToFlag } from '../../utils';
import Avatar from '../Avatar';
import styles from './TandemBubble.module.css';

interface TandemBubbleProps {
    language: Language;
    onTandemPressed: () => void;
    profile?: Profile;
}

const TandemBubble: React.FC<TandemBubbleProps> = ({ language, onTandemPressed, profile }) => {
    return (
        <button className={styles.container} onClick={onTandemPressed}>
            <div className={styles.profile}>
                <Avatar user={profile?.user} className={styles.avatar} />
                <span className={styles.name}>{profile?.user.firstname}</span>
            </div>
            <div className={styles['flag-container']}>
                <span className={styles.flag}>{codeLanguageToFlag(language.code)}</span>
            </div>
        </button>
    );
};

export default TandemBubble;
