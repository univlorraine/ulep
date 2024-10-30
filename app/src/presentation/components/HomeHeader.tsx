import { IonHeader } from '@ionic/react';
import { useConfig } from '../../context/ConfigurationContext';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {}

const HomeHeader: React.FC<HomeHeaderProps> = () => {
    const { logoUrl } = useConfig();
    return (
        <IonHeader>
            <div className={styles['header-container']}>
                <div className={styles['logo-container']}>
                    <img alt="ULEP" className={styles.logo} src={logoUrl} />
                    <div className={styles['header-separator']} />
                    <span className={styles['app-name']}>ULEP</span>
                </div>
            </div>
        </IonHeader>
    );
};

export default HomeHeader;
