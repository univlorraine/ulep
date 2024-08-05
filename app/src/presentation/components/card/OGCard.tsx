import { IonImg, IonText } from '@ionic/react';
import styles from './OGCard.module.css';

interface OGCardProps {
    imageUrl?: string;
    title: string;
    description: string;
    url: string;
}

const OGCard: React.FC<OGCardProps> = ({ imageUrl, title, description, url }) => {
    return (
        <div className={styles.container}>
            {imageUrl && (
                <div className={styles.image}>
                    <IonImg src={imageUrl} />
                </div>
            )}
            <div className={styles.content}>
                <IonText className={styles.title}>{title}</IonText>
                <IonText className={styles.description}>{description}</IonText>
            </div>
        </div>
    );
};

export default OGCard;
