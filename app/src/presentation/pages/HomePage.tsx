import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { ArrowDownSvg, ReportSvg } from '../../assets';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import HomeHeader from '../components/HomeHeader';
import ProfileModal from '../components/modals/ProfileModal';
import ReportModal from '../components/modals/ReportModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import TandemList from '../components/tandems/TandemList';
import WaitingTandemList from '../components/tandems/WaitingTandemList';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH, learningLanguagesToTestedLanguages } from '../utils';
import styles from './css/Home.module.css';
import Avatar from '../components/Avatar';
import useLogout from '../hooks/useLogout';
import Loader from '../components/Loader';
import MyUniversityCard from '../components/card/MyUniversityCard';
import PartnerUniversitiesCard from '../components/card/PartnerUniversitiesCard';
import useGetHomeData from '../hooks/useGetHomeData';
import ProficiencyTestCard from '../components/card/ProficiencyTestCard';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const currentDate = new Date();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [displayProfile, setDisplayProfile] = useState<boolean>(false);
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();

    const { tandems, partnerUniversities, error, isLoading } = useGetHomeData();

    const { handleLogout } = useLogout();

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    const onProfilePressed = () => (isHybrid ? history.push('/profil') : setDisplayProfile(true));

    const onReportPressed = () => (isHybrid ? history.push('/report') : setDisplayReport(true));

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid
            ? setSelectedTandem(tandem)
            : history.push('/tandem-profil', {
                  profile: tandem.partner,
                  language: tandem.learningLanguage,
                  level: tandem.level,
                  pedagogy: tandem.pedagogy,
                  tandemLearningLanguage: tandem.partnerLearningLanguage,
              });

    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getDate().toString().padStart(2, '0')}-${(
        currentDate.getMonth() + 1
    )
        .toString()
        .padStart(2, '0')}`;

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    return (
        <IonPage className={styles.content}>
            {!isHybrid && <HomeHeader user={profile.user} onPicturePressed={onProfilePressed} />}
            <IonContent>
                <div className={`${styles.container} content-wrapper`}>
                    <div className={styles['header']}>
                        <div className={styles['hello-container']}>
                            <span className={styles.date}>{formattedDate}</span>
                            <span className={styles.hello}>{`${t('global.hello')} ${profile.user.firstname}`}</span>
                        </div>
                        {isHybrid && (
                            <button
                                aria-label={t('global.change_avatar') as string}
                                className={styles['avatar-container']}
                                onClick={onProfilePressed}
                            >
                                <Avatar user={profile.user} className={styles.avatar} />
                                <img alt="" src={ArrowDownSvg} />
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
                            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 768: 2 }}>
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
                                    <img alt="" className="margin-right" src={ReportSvg} />
                                    <span>{t('home_page.report.report_button')}</span>
                                </>
                            }
                        </button>
                    </div>
                </div>
            </IonContent>
            {!isHybrid && (
                <>
                    <ReportModal isVisible={displayReport} onClose={() => setDisplayReport(false)} />
                    <ProfileModal
                        isVisible={displayProfile}
                        onClose={() => setDisplayProfile(false)}
                        onDisconnect={handleLogout}
                        profile={profile}
                    />
                    <TandemStatusModal
                        isVisible={
                            !!selectedTandem &&
                            (selectedTandem.status === 'DRAFT' ||
                                selectedTandem.status === 'INACTIVE' ||
                                selectedTandem.status === 'VALIDATED_BY_ONE_UNIVERSITY')
                        }
                        onClose={() => setSelectedTandem(undefined)}
                        onFindNewTandem={() => history.push('pairing/languages')}
                        status={selectedTandem?.status}
                    />
                    <TandemProfileModal
                        isVisible={!!selectedTandem && selectedTandem.status === 'ACTIVE'}
                        language={selectedTandem?.learningLanguage}
                        level={selectedTandem?.level}
                        onClose={() => setSelectedTandem(undefined)}
                        partnerLearningLanguage={selectedTandem?.partnerLearningLanguage}
                        pedagogy={selectedTandem?.pedagogy}
                        profile={selectedTandem?.partner}
                    />
                </>
            )}
        </IonPage>
    );
};

export default HomePage;
