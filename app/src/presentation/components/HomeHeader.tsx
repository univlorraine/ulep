import { IonButton, IonHeader } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { ArrowDownSvg, LogoTextSvg } from '../../assets';
import User from '../../domain/entities/User';
import Avatar from './Avatar';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {
    user: User;
    onPicturePressed: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ user, onPicturePressed }) => {
    const { t } = useTranslation();
    return (
        <IonHeader>
            <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                    <img alt="ULEP" className={styles.logo} src={LogoTextSvg} />
                    <div className={styles['header-separator']} />
                    <span className={styles['app-name']}>ULEP</span>
                </div>
                <IonButton
                    fill="clear"
                    aria-label={t('global.change_avatar') as string}
                    className={styles['avatar-container']}
                    onClick={onPicturePressed}
                >
                    <Avatar user={user} className={styles.avatar} />
                    <img alt={t('global.change_avatar') as string} src={ArrowDownSvg} />
                </IonButton>
            </div>
        </IonHeader>
    );
};

export default HomeHeader;
