import { useTranslation } from 'react-i18next';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/ErrorPage.module.css';
import { format } from 'date-fns';

interface ServiceClosePageProps {
    openDate: Date;
    closeDate: Date;
}

const ServiceClosePage: React.FC<ServiceClosePageProps> = ({ openDate, closeDate }) => {
    const { t } = useTranslation();

    return (
        <WebLayoutCentered
            backgroundIconColor="#FDEE66"
            headerColor="#EDDF5E"
            headerPercentage={0}
            headerTitle={t('global.error')}
        >
            <div className={styles.body}>
                <h1 className="title">{t('service_close.title')}</h1>
                <h2 className="subtitle">{t('service_close.subtitle', {start: format(openDate, 'dd/MM/yyyy'), end: format(closeDate, 'dd/MM/yyyy')})}</h2>
            </div>
        </WebLayoutCentered>
    );
};

export default ServiceClosePage;
