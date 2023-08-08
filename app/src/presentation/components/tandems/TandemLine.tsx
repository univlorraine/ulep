import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../assets';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import styles from './TandemLine.module.css';

interface TandemLineProps {
    language: Language;
    profile?: Profile;
    onPressed: () => void;
    status: TandemStatus;
}

const getTitleFromStatusAndProfile = (status: TandemStatus, hasProfile: boolean) => {
    if (status === 'DRAFT') {
        return 'home_page.waiting_tandem.tandem_draft';
    }

    if (status === 'UNACTIVE' && hasProfile) {
        return 'home_page.waiting_tandem.tandem_unavailable';
    }

    if (status === 'UNACTIVE' && !hasProfile) {
        return 'home_page.waiting_tandem.tandem_not_found';
    }

    return '';
};

const TandemLine: React.FC<TandemLineProps> = ({ language, profile, onPressed, status }) => {
    const { t } = useTranslation();
    return (
        <button className={styles.container} onClick={onPressed}>
            <div className={styles['left-container']}>
                <div className={styles['flag-container']}>
                    <span className={styles.flag}>{language.getFlag()}</span>
                </div>
                <span className={styles.title}>{t(getTitleFromStatusAndProfile(status, !!profile))}</span>
            </div>
            <img alt="arrow-right" src={ArrowRightSvg} />
        </button>
    );
};

export default TandemLine;
