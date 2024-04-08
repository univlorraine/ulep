import { IonHeader } from '@ionic/react';
import { ArrowDownSvg, LogoTextSvg } from '../../assets';
import styles from './HomeHeader.module.css';
import User from '../../domain/entities/User';
import Avatar from './Avatar';

interface HomeHeaderProps {
    user: User;
    onPicturePressed: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ user, onPicturePressed }) => {
    return (
        <IonHeader>
            <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                    <img alt="ULEP" className={styles.logo} src={LogoTextSvg} />
                    <div className={styles['header-separator']} />
                    <span className={styles['app-name']}>ULEP</span>
                </div>
                <button aria-label="Change avatar" className={styles['avatar-container']} onClick={onPicturePressed}>
                    <Avatar user={user} className={styles.avatar} />
                    <img alt="Change avatar" src={ArrowDownSvg} />
                </button>
            </div>
        </IonHeader>
    );
};

export default HomeHeader;
