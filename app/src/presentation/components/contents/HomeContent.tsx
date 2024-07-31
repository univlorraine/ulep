import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useHistory } from 'react-router';
import { ArrowDownSvg, ReportSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import University from '../../../domain/entities/University';
import Avatar from '../../components/Avatar';
import Loader from '../../components/Loader';
import MyUniversityCard from '../../components/card/MyUniversityCard';
import PartnerUniversitiesCard from '../../components/card/PartnerUniversitiesCard';
import ProficiencyTestCard from '../../components/card/ProficiencyTestCard';
import TandemList from '../../components/tandems/TandemList';
import WaitingTandemList from '../../components/tandems/WaitingTandemList';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH, learningLanguagesToTestedLanguages } from '../../utils';
import styles from './HomeContent.module.css';

interface HomeContentProps {
    isLoading: boolean;
    profile: Profile;
    onProfilePressed: () => void;
    onReportPressed: () => void;
    onTandemPressed: (tandem: Tandem) => void;
    onValidatedTandemPressed: (tandem: Tandem) => void;
    tandems: Tandem[];
    partnerUniversities: University[];
}

const HomeContent: React.FC<HomeContentProps> = ({
    isLoading,
    profile,
    onProfilePressed,
    onReportPressed,
    onTandemPressed,
    onValidatedTandemPressed,
    partnerUniversities,
    tandems,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
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
                    {isHybrid && (
                        <button
                            aria-label={t('global.change_avatar') as string}
                            className={styles['avatar-container']}
                            onClick={onProfilePressed}
                        >
                            <Avatar user={profile.user} className={styles.avatar} />
                            <img alt="" src={ArrowDownSvg} aria-hidden={true} />
                        </button>
                    )}
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
                                <WaitingTandemList
                                    onTandemPressed={onTandemPressed}
                                    onNewTandemAsked={() => history.push('pairing/languages')}
                                    profile={profile}
                                    tandems={tandems}
                                />
                                <MyUniversityCard university={profile.user.university} />
                                {partnerUniversities?.length > 0 && (
                                    <PartnerUniversitiesCard universities={partnerUniversities} />
                                )}
                                {(profile.learningLanguages.length > 0 || profile.testedLanguages.length > 0) && (
                                    <ProficiencyTestCard
                                        testedLanguages={learningLanguagesToTestedLanguages(
                                            profile.learningLanguages,
                                            profile.testedLanguages
                                        )}
                                    />
                                )}
                            </Masonry>
                        </ResponsiveMasonry>
                    )}
                </div>
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
            </div>
        </div>
    );
};

export default HomeContent;
