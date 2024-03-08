import { useTranslation } from 'react-i18next';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/ErrorPage.module.css';
import { format } from 'date-fns';
import { useStoreActions } from '../../store/storeTypes';
import { useConfig } from '../../context/ConfigurationContext';

interface ServiceClosePageProps {
    openDate: Date;
    closeDate: Date;
}

const ServiceClosePage: React.FC<ServiceClosePageProps> = ({ openDate, closeDate }) => {
    const { t } = useTranslation();

    const { logout } = useStoreActions((store) => store);
    const { revokeSessionsUsecase } = useConfig();

    const handleDisconnect = async (): Promise<void> => {
        await revokeSessionsUsecase.execute();
        logout();
        // Note: history.push doesn't work here since this component is out of Ion-Router
        window.location.href = '/';
    };
    return (
        <WebLayoutCentered
            backgroundIconColor="#FDEE66"
            headerColor="#EDDF5E"
            headerPercentage={0}
            headerTitle={t('global.error')}
            goBackPressed={handleDisconnect}
        >
            <div className={styles.body}>
                <h1 className="title">{t('service_close.title')}</h1>
                <h2 className="subtitle">
                    {t('service_close.subtitle', {
                        start: format(openDate, 'dd/MM/yyyy'),
                        end: format(closeDate, 'dd/MM/yyyy'),
                    })}
                </h2>
            </div>
        </WebLayoutCentered>
    );
};

export default ServiceClosePage;
