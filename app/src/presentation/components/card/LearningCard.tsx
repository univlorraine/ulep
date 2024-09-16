import { IonButton } from '@ionic/react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import styles from './LearningCard.module.css';

interface LearningCardProps {
    buttonText?: string;
    children: React.ReactNode;
    onButtonPressed?: () => void;
    title: string;
}

const LearningCard: React.FC<LearningCardProps> = ({ buttonText, children, onButtonPressed, title }) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className="home-card-title">{title}</span>
                {!isHybrid && onButtonPressed && (
                    <IonButton fill="clear" className={`primary-button ${styles.button}`} onClick={onButtonPressed}>
                        <span>{buttonText}</span>
                    </IonButton>
                )}
            </div>
            {children}
        </div>
    );
};

export default LearningCard;
