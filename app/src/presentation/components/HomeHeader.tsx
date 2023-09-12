import { IonHeader } from '@ionic/react';
import { ArrowDownSvg, LogoTextSvg } from '../../assets';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {
    avatar: string;
    onPicturePressed: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ avatar, onPicturePressed }) => {
    return (
        <IonHeader>
            <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                    <img alt="logo" className={styles.logo} src={LogoTextSvg} />
                    <div className={styles['header-separator']} />
                    <span className={styles['app-name']}>ULEP</span>
                </div>
                <button className={styles['avatar-container']} onClick={onPicturePressed}>
                    <img alt="avatar" className={styles.avatar} src={avatar} />
                    <img alt="arrow-down" src={ArrowDownSvg} />
                </button>
            </div>
        </IonHeader>
    );
};

export default HomeHeader;
