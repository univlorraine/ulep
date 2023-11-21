import { useTranslation } from 'react-i18next';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/ErrorPage.module.css';

const MaintenancePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <WebLayoutCentered
            backgroundIconColor="#FDEE66"
            headerColor="#EDDF5E"
            headerPercentage={0}
            goBackPressed={() => window.location.reload()}
            headerTitle={t('global.error')}
        >
            <div className={styles.body}>
                <h1 className="title">{t('maintenance_page.title')}</h1>
                <h2 className="subtitle">{t('maintenance_page.subtitle')}</h2>
            </div>
        </WebLayoutCentered>
    );
};

export default MaintenancePage;
