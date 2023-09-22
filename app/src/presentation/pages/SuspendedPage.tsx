import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import ReportModal from '../components/modals/ReportModal';
import styles from './css/Suspended.module.css';
import { AvatarPlaceholderPng } from '../../assets';

const SuspendedPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const logout = useStoreActions((state) => state.logout);
    const [isReportMode, setReportMode] = useState<boolean>(false);

    const disconnect = async () => {
        await logout();
    }

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            goBackPressed={disconnect}
            headerColor={configuration.primaryColor}
            headerPercentage={100}
            headerTitle={t('global.account')}
        >
            <>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <h1 className="title">{t('suspended_page.title')}</h1>
                        <img alt="avatar" className={styles.image} src={profile?.user.avatar ?? AvatarPlaceholderPng} />
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
