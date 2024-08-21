import { IonHeader } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { LogoTextSvg } from '../../assets';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {}

const HomeHeader: React.FC<HomeHeaderProps> = () => {
    const { t } = useTranslation();
    return (
        <IonHeader>
            <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                    <img alt="ULEP" className={styles.logo} src={LogoTextSvg} />
                    <div className={styles['header-separator']} />
                    <span className={styles['app-name']}>ULEP</span>
                </div>
            </div>
        </IonHeader>
    );
};

export default HomeHeader;
