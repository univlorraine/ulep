import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import ReportModal from '../components/modals/ReportModal';
import styles from './css/Suspended.module.css';

const SuspendedPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [isReportMode, setReportMode] = useState<boolean>(false);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={100}
            headerTitle={t('global.account')}
        >
            <>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <h1 className="title">{t('suspended_page.title')}</h1>
                        <img alt="avatar" className={styles.image} src={profile?.user.avatar} />
                        <p className={styles.subtitle}>
                            {t('suspended_page.subtitle')}
                            <br />
                            <br />
                            {t('suspended_page.contact_us')}
                        </p>
                    </div>
                    <div className="extra-large-margin-bottom">
                        <button className={`primary-button `} onClick={() => setReportMode(true)}>
                            {t('suspended_page.validate_button')}
                        </button>
                    </div>
                </div>
                <ReportModal isVisible={isReportMode} onClose={() => setReportMode(false)} />
            </>
        </WebLayoutCentered>
    );
};

export default SuspendedPage;
