import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import ReportModal from '../components/modals/ReportModal';
import styles from './css/Suspended.module.css';
import { AvatarPlaceholderPng } from '../../assets';
import Avatar from '../components/Avatar';

interface SuspendedPageProps {
    status: UserStatus;
}

const SuspendedPage: React.FC<SuspendedPageProps> = ({ status }) => {
    const { t } = useTranslation();
    const { accessToken, configuration, getProfile } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const logout = useStoreActions((state) => state.logout);
    const setProfile = useStoreActions((state) => state.setProfile);
    const [isReportMode, setReportMode] = useState<boolean>(false);

    const disconnect = async () => {
        await logout();
    };

    const reloadProfile = async () => {
        const profile = await getProfile.execute(accessToken);

        if(profile instanceof Error){
            return await disconnect();
        }

        return setProfile({ profile });
    }

    useEffect(() => {
        reloadProfile();
    }, []);

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
                        <h1 className="title">
                            {status === 'BANNED' ? t('suspended_page.title') : t('suspended_page.title_canceled')}
                        </h1>
                        <Avatar user={profile?.user} className={styles.image} />
                        <p className={styles.subtitle}>
                            {status === 'BANNED' ? t('suspended_page.subtitle') : t('suspended_page.subtitle_canceled')}
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
