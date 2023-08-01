import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import Tandem from '../../domain/entities/Tandem';
import HomeHeader from '../components/HomeHeader';
import DraftTandemContent from '../components/contents/DraftTandemContent';
import Modal from '../components/modals/Modal';
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
    const [tandems, setTandems] = useState<Tandem[]>([]);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();

    const getHomeData = async () => {
        const result = await getAllTandems.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setTandems(result);
    };

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
            {width >= HYBRID_MAX_WIDTH && <HomeHeader avatar={profile.avatar} onPicturePressed={() => null} />}
            <IonContent>
                <div className={styles.container}>
                    <div className={styles['header']}>
                        <div className={styles['hello-container']}>
                            <span className={styles.date}>{formattedDate}</span>
                            <span className={styles.hello}>{`${t('global.hello')} ${profile.firstname}`}</span>
                        </div>
                        {width < HYBRID_MAX_WIDTH && (
                            <button className={styles['avatar-container']} onClick={() => history.push('/home')}>
                                <img alt="avatar" className={styles.avatar} src={profile.avatar} />
                                <img alt="arrow-down" src="/assets/arrow-down.svg" />
                            </button>
                        )}
                    </div>
                    {width < HYBRID_MAX_WIDTH && <div className={styles.separator} />}
                    <div className={styles.content}>
                        <TandemList studentId={profile.id} tandems={tandems} />
                        <WaitingTandemList
                            onTandemPressed={setSelectedTandem}
                            onNewTandemAsked={() => null}
                            studentId={profile.id}
                            tandems={tandems}
                        />
                    </div>
                </div>
            </IonContent>
            <Modal isVisible={!!selectedTandem} onClose={() => setSelectedTandem(undefined)} hideWhiteBackground>
                <DraftTandemContent onClose={() => setSelectedTandem(undefined)} />
            </Modal>
        </IonPage>
    );
};

export default HomePage;
