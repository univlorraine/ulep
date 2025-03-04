import { IonButton, IonIcon, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import User from '../../../domain/entities/User';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Avatar from '../Avatar';
import Loader from '../Loader';
import NetworkImage from '../NetworkImage';
import styles from './ProfileDetailsCard.module.css';

interface ProfileDetailsCardProps {
    user: User;
    title: string;
    onPress: () => void;
    textButton: string;
    subtitle: string;
    firstInfo?: string;
    secondInfo?: string;
    thirdInfo?: string;
    isProfileCard?: boolean;
    isLoading?: boolean;
}

const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = ({
    user,
    title,
    onPress,
    textButton,
    subtitle,
    firstInfo,
    secondInfo,
    thirdInfo,
    isProfileCard,
    isLoading,
}) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <div className={`${styles.card} ${isProfileCard ? styles.profile_card : ''} ${isHybrid ? styles.hybrid : ''}`}>
            <div className={styles.container_title}>
                <h2 className={styles.title}>{title}</h2>
                {!isHybrid && (
                    <IonButton
                        fill="clear"
                        className={`primary-button ${styles.button}`}
                        onClick={onPress}
                        size="small"
                    >
                        <IonText>{textButton}</IonText>
                    </IonButton>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.infos}>
                    {isProfileCard && isLoading && <Loader />}
                    {isProfileCard && !isLoading && <Avatar user={user} className={styles.image} />}
                    {!isProfileCard && (
                        <NetworkImage id={user.university.logo || ''} className={`${styles.image} ${styles.logo}`} />
                    )}
                    <div className={styles.details}>
                        <p className={styles.subtitle}>{subtitle}</p>
                        <div>
                            <p>{firstInfo}</p>
                            {secondInfo && <p>{secondInfo}</p>}
                            {thirdInfo && <p>{thirdInfo}</p>}
                        </div>
                    </div>
                </div>
                {isHybrid && (
                    <IonButton
                        fill="clear"
                        className={`tertiary-button ${styles.button}`}
                        onClick={onPress}
                        size="small"
                    >
                        <IonIcon className={styles.icon} icon={searchOutline} slot="start" />
                        <IonText>{textButton}</IonText>
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default ProfileDetailsCard;
