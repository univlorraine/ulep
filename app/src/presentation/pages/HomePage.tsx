import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { ArrowDownSvg, ReportSvg } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import Tandem from '../../domain/entities/Tandem';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
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

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { getAllTandems } = useConfig();
    const [showToast] = useIonToast();
    const logout = useStoreActions((store) => store.logout);
    const currentDate = new Date();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [displayProfile, setDisplayProfile] = useState<boolean>(false);
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [tandems, setTandems] = useState<Tandem[]>([]);

    const getHomeData = async () => {
        const result = await getAllTandems.execute(profile!.id);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setTandems(result);
    };

    useEffect(() => {
        getHomeData();
    }, []);

    const onDisconnect = () => {
        return logout();
    };

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
        <IonPage>
            {!isHybrid && <HomeHeader avatar={profile.user.avatar} onPicturePressed={onProfilePressed} />}
            <IonContent>
                <div className={styles.container}>
                    <div className={styles['header']}>
                        <div className={styles['hello-container']}>
                            <span className={styles.date}>{formattedDate}</span>
                            <span className={styles.hello}>{`${t('global.hello')} ${profile.user.firstname}`}</span>
                        </div>
                        {isHybrid && (
                            <button className={styles['avatar-container']} onClick={onProfilePressed}>
                                <img alt="avatar" className={styles.avatar} src={profile.user.avatar} />
                                <img alt="arrow-down" src={ArrowDownSvg} />
                            </button>
                        )}
                    </div>
                    {isHybrid && <div className={styles.separator} />}
                    <div className={styles.content}>
                        <TandemList onTandemPressed={onValidatedTandemPressed} tandems={tandems} />
                        <WaitingTandemList
                            onTandemPressed={onTandemPressed}
                            onNewTandemAsked={() => history.push('pairing/languages')}
                            tandems={tandems}
                        />
                    </div>
                    <div className={styles['report-container']}>
                        <button className={`tertiary-button ${styles.report}`} onClick={onReportPressed}>
                            {
                                <>
                                    <img alt="report" className="margin-right" src={ReportSvg} />
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
                        onDisconnect={onDisconnect}
                        profileFirstname={profile.user.firstname}
                        profileLastname={profile.user.lastname}
                        profilePicture={profile.user.avatar}
                    />
                    <TandemStatusModal
                        isVisible={
                            !!selectedTandem &&
                            (selectedTandem.status === 'DRAFT' ||
                                selectedTandem.status === 'UNACTIVE' ||
                                selectedTandem.status === 'VALIDATED_BY_ONE_UNIVERSITY')
                        }
                        onClose={() => setSelectedTandem(undefined)}
                        status={selectedTandem?.status}
                    />
                    <TandemProfileModal
                        isVisible={!!selectedTandem && selectedTandem.status === 'ACTIVE'}
                        language={selectedTandem?.learningLanguage}
                        onClose={() => setSelectedTandem(undefined)}
                        profile={selectedTandem?.partner}
                    />
                </>
            )}
        </IonPage>
    );
};

export default HomePage;
