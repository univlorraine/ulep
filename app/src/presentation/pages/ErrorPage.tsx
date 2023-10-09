import { useTranslation } from 'react-i18next';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/ErrorPage.module.css';

const ErrorPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <WebLayoutCentered
            backgroundIconColor="#FDEE66"
            headerColor="#EDDF5E"
            headerPercentage={0}
            headerTitle={t('global.error')}
        >
            <div className={styles.body}>
                <h1 className="title">{t('error_page.title')}</h1>
                <h2 className="subtitle">{t('error_page.subtitle')}</h2>
            </div>
        </WebLayoutCentered>
    );
};

export default ErrorPage;
