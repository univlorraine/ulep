import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReportSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import Loader from '../../components/Loader';
import TandemList from '../../components/tandems/TandemList';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import SessionListHome from '../sessions/SessionListHome';
import styles from './HomeContent.module.css';

interface HomeContentProps {
    isLoading: boolean;
    profile: Profile;
    onReportPressed?: () => void;
    onValidatedTandemPressed: (tandem: Tandem) => void;
    tandems: Tandem[];
    sessions: Session[];
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onCreateSessionPressed: (tandem: Tandem) => void;
    onShowSessionListPressed: () => void;
    onShowNewsPressed: () => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
    isLoading,
    profile,
    onReportPressed,
    onValidatedTandemPressed,
    tandems,
    sessions,
    onShowSessionPressed,
    onUpdateSessionPressed,
    onCreateSessionPressed,
    onShowSessionListPressed,
    onShowNewsPressed,
}) => {
    const { t } = useTranslation();
    const currentDate = new Date();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getDate().toString().padStart(2, '0')}-${(
        currentDate.getMonth() + 1
    )
        .toString()
        .padStart(2, '0')}`;

    return (
        <div className={styles.content}>
            <div className={`${styles.container} content-wrapper`}>
                <div className={styles['header']}>
                    <div className={styles['hello-container']}>
                        <span className={styles.date}>{formattedDate}</span>
                        <h1 className={styles.hello}>{`${t('global.hello')} ${profile.user.firstname}`}</h1>
                    </div>
                </div>
                {isHybrid && <div className={styles.separator} />}
                <div className={styles['masonery-content']}>
                    {isLoading ? (
                        <div className={styles.loaderContainer}>
                            <Loader />
                        </div>
                    ) : (
                        <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1024: 2 }}>
                            <Masonry className={styles.masonery} gutter="20px">
                                {tandems.find((tandem) => tandem.status === 'ACTIVE') && (
                                    <TandemList onTandemPressed={onValidatedTandemPressed} tandems={tandems} />
                                )}
                            </Masonry>
                            <Masonry className={styles.masonery} gutter="20px">
                                {tandems.find((tandem) => tandem.status === 'ACTIVE') && (
                                    <SessionListHome
                                        tandems={tandems}
                                        sessions={sessions}
                                        onShowSessionListPressed={onShowSessionListPressed}
                                        onShowSessionPressed={onShowSessionPressed}
                                        onUpdateSessionPressed={onUpdateSessionPressed}
                                        onCreateSessionPressed={onCreateSessionPressed}
                                        isHybrid={isHybrid}
                                    />
                                )}
                            </Masonry>
                            <Masonry className={styles.masonery} gutter="20px">
                                <IonButton onClick={onShowNewsPressed}>{t('home_page.news.title')}</IonButton>
                            </Masonry>
                        </ResponsiveMasonry>
                    )}
                </div>
                {isHybrid && (
                    <div className={styles['report-container']}>
                        <button
                            aria-label={t('home_page.report.report_button') as string}
                            className={`tertiary-button ${styles.report}`}
                            onClick={onReportPressed}
                        >
                            {
                                <>
                                    <img alt="" className="margin-right" src={ReportSvg} aria-hidden={true} />
                                    <span>{t('home_page.report.report_button')}</span>
                                </>
                            }
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeContent;
