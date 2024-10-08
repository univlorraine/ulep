import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { codeLanguageToFlag } from '../../utils';
import Avatar from '../Avatar';
import styles from './TandemBubble.module.css';

interface TandemBubbleProps {
    language: Language;
    profile?: Profile;
}

const TandemBubble: React.FC<TandemBubbleProps> = ({ language, profile }) => {
    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <Avatar user={profile?.user} className={styles.avatar} />
            </div>
            <div className={styles['flag-container']}>
                <span className={styles.flag} role="img" aria-label={language.name}>
                    {codeLanguageToFlag(language.code)}
                </span>
            </div>
        </div>
    );
};

export default TandemBubble;
