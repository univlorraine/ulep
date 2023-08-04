import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import Tandem from '../../domain/entities/Tandem';
import HomeHeader from '../components/HomeHeader';
import ProfileModal from '../components/modals/ProfileModal';
import ReportModal from '../components/modals/ReportModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import TandemList from '../components/tandems/TandemList';
import WaitingTandemList from '../components/tandems/WaitingTandemList';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import styles from './css/Home.module.css';

//TODO: Change this when create Profile will be done
const profile = new Profile(
    'id',
    'email',
    'firstname',
    'lastname',
    22,
    'MALE',
    'id',
    'STUDENT',
    'FR',
    'CN',
    ['goal'],
    'ONCE_A_WEEK',
    ['interest'],
    ['bios'],
    '/assets/avatar.svg'
);

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { getAllTandems } = useConfig();
    const [showToast] = useIonToast();
    const currentDate = new Date();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [displayProfile, setDisplayProfile] = useState<boolean>(false);
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [tandems, setTandems] = useState<Tandem[]>([]);

    const getHomeData = async () => {
        const result = await getAllTandems.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setTandems(result);
    };

    const onProfilePressed = () => (isHybrid ? history.push('/profil') : setDisplayProfile(true));

    const onReportPressed = () => (isHybrid ? history.push('/report') : setDisplayReport(true));

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid
            ? setSelectedTandem(tandem)
            : history.push('/tandem-profil', {
                  profile: tandem.profiles.find((tandemProfile) => tandemProfile.id !== profile.id),
                  language: tandem.language,
              });

    useEffect(() => {
        getHomeData();
    }, []);

    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getDate().toString().padStart(2, '0')}-${(
        currentDate.getMonth() + 1
    )
        .toString()
        .padStart(2, '0')}`;
    return (
        <IonPage>
            {!isHybrid && <HomeHeader avatar={profile.avatar} onPicturePressed={onProfilePressed} />}
            <IonContent>
                <div className={styles.container}>
                    <div className={styles['header']}>
                        <div className={styles['hello-container']}>
                            <span className={styles.date}>{formattedDate}</span>
                            <span className={styles.hello}>{`${t('global.hello')} ${profile.firstname}`}</span>
                        </div>
                        {isHybrid && (
                            <button className={styles['avatar-container']} onClick={onProfilePressed}>
                                <img alt="avatar" className={styles.avatar} src={profile.avatar} />
                                <img alt="arrow-down" src="/assets/arrow-down.svg" />
                            </button>
                        )}
                    </div>
                    {isHybrid && <div className={styles.separator} />}
                    <div className={styles.content}>
                        <TandemList
                            onTandemPressed={onValidatedTandemPressed}
                            studentId={profile.id}
                            tandems={tandems}
                        />
                        <WaitingTandemList
                            onTandemPressed={onTandemPressed}
                            onNewTandemAsked={() => null}
                            studentId={profile.id}
                            tandems={tandems}
                        />
                    </div>
                    <div className={styles['report-container']}>
                        <button className={`tertiary-button ${styles.report}`} onClick={onReportPressed}>
                            {
                                <>
                                    <img alt="report" className="margin-right" src="/assets/report.svg" />
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
                        profileFirstname={profile.firstname}
                        profileLastname={profile.lastname}
                        profilePicture={profile.avatar}
                    />
                    <TandemStatusModal
                        isVisible={
                            !!selectedTandem &&
                            (selectedTandem.status === 'DRAFT' || selectedTandem.status === 'UNACTIVE')
                        }
                        onClose={() => setSelectedTandem(undefined)}
                        status={selectedTandem?.status}
                    />
                    <TandemProfileModal
                        isVisible={!!selectedTandem && selectedTandem.status === 'ACTIVE'}
                        language={selectedTandem?.language}
                        onClose={() => setSelectedTandem(undefined)}
                        profile={selectedTandem?.profiles.find((tandemProfile) => tandemProfile.id !== profile.id)}
                    />
                </>
            )}
        </IonPage>
    );
};

export default HomePage;
