import University from '../../domain/entities/University';
import styles from './UniversityTag.module.css';

interface UniversityTagProps {
    university: University;
}

const UniversityTag: React.FC<UniversityTagProps> = ({ university }) => {
    const universityStyle = university.isCentral ? styles.central : styles.partner;
    return (
        <div className={`${styles.container} ${universityStyle}`}>
            <span className={styles.text}>{university.name}</span>
        </div>
    );
};

export default UniversityTag;
