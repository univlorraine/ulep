import Language from '../../../domain/entities/Language';
import University from '../../../domain/entities/University';
import styles from './TandemCard.module.css';

interface TandemCardProps {
    avatar: string;
    fistname: string;
    language: Language;
    lastname: string;
    university: University;
}

const TandemCard: React.FC<TandemCardProps> = ({ avatar, fistname, language, lastname, university }) => {
    return (
        <div className={styles['container']}>
            <div className={styles.card2} />
            <div className={styles.card1} />
            <div className={styles.card}>
                <div className={styles.content}>
                    <img alt="avatar" className={styles.avatar} src={avatar} />
                    <div className={styles.bubble}>{language.getFlag()}</div>
                    <div className={styles['text-container']}>
                        <span className={styles.name}>{`${fistname} ${lastname}`}</span>
                        <span className={styles['university-name']}>{university.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TandemCard;
