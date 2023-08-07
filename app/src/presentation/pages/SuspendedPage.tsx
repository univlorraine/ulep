import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarSvg } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import ReportModal from '../components/modals/ReportModal';
import styles from './css/Suspended.module.css';
//TODO: Change this when create Profile will be done
const profile = new Profile(
    'id',
    'email',
    'firstname',
    'lastname',
    22,
    'male',
    'id',
    'student',
    'FR',
    'CN',
    ['goal'],
    'ONCE_A_WEEK',
    ['interest'],
    ['bios'],
    '/assets/avatar.svg'
);

const SuspendedPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
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
                        <img alt="avatar" className={styles.image} src={AvatarSvg} />
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
