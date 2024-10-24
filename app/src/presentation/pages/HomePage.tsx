import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import EventObject from '../../domain/entities/Event';
import News from '../../domain/entities/News';
import Session from '../../domain/entities/Session';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import HomeContent from '../components/contents/HomeContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import EndSessionModal from '../components/modals/EndSessionModal';
import EventsContentModal, {
    DisplayEventsContentModal,
    DisplayEventsContentModalEnum,
} from '../components/modals/EventsContentModal';
import NewsContentModal, {
    DisplayNewsContentModal,
    DisplayNewsContentModalEnum,
} from '../components/modals/NewsContentModal';
import SessionsContentModal, {
    DisplaySessionModal,
    DisplaySessionModalEnum,
} from '../components/modals/SessionsContentModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import useGetHomeData from '../hooks/useGetHomeData';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

interface HomePageLocationProps {
    endSession: boolean;
}

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [displaySessionModal, setDisplaySessionModal] = useState<DisplaySessionModal>();
    const [displayNewsContent, setDisplayNewsContent] = useState<DisplayNewsContentModal>();
    const [displayEventsContent, setDisplayEventsContent] = useState<DisplayEventsContentModal>();
    const { tandems, events, sessions, news, error, isLoading } = useGetHomeData(refresh);
    const location = useLocation<HomePageLocationProps>();
    const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState<boolean>(location.state?.endSession || false);

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    const onReportPressed = () => (isHybrid ? history.push('/report') : undefined);

    const onCompleteLearningJournalPressed = () => setIsEndSessionModalOpen(false);

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-profil', { tandem });

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const onShowSessionListPressed = () => {
        if (isHybrid) {
            history.push('/sessions', { tandems, sessions });
        } else {
            setDisplaySessionModal({
                type: DisplaySessionModalEnum.list,
            });
        }
    };

    const onShowSessionPressed = (session: Session, tandem: Tandem, confirmCreation?: boolean) => {
        if (isHybrid) {
            history.push('show-session', { session, tandem, confirmCreation });
        } else {
            handleRefresh();
            setDisplaySessionModal({
                type: DisplaySessionModalEnum.show,
                tandem,
                session,
                confirmCreation,
            });
        }
    };

    const onUpdateSessionPressed = (session: Session, tandem: Tandem) => {
        if (isHybrid) {
            history.push('update-session', { session, tandem });
        } else {
            setDisplaySessionModal({
                type: DisplaySessionModalEnum.form,
                tandem,
                session,
            });
        }
    };

    const onCreateSessionPressed = (tandem: Tandem) => {
        if (isHybrid) {
            history.push('create-session', { tandem });
        } else {
            setDisplaySessionModal({
                type: DisplaySessionModalEnum.form,
                tandem,
            });
        }
    };

    const onShowNewsPressed = (selectedNews?: News) => {
        if (isHybrid) {
            history.push(selectedNews ? 'show-news' : 'news', { news: selectedNews });
        } else {
            setDisplayNewsContent({
                type: selectedNews ? DisplayNewsContentModalEnum.show : DisplayNewsContentModalEnum.list,
                news: selectedNews,
            });
        }
    };

    const onShowCloseNewsPressed = () => {
        if (displayNewsContent?.type === DisplayNewsContentModalEnum.show) {
            setDisplayNewsContent({ type: DisplayNewsContentModalEnum.list });
        } else {
            setDisplayNewsContent(undefined);
        }
    };

    const onShowEventPressed = (selectedEvent?: EventObject) => {
        if (isHybrid) {
            history.push(selectedEvent ? 'show-event' : 'events', { event: selectedEvent });
        } else {
            setDisplayEventsContent({
                type: selectedEvent ? DisplayEventsContentModalEnum.show : DisplayEventsContentModalEnum.list,
                event: selectedEvent,
            });
        }
    };

    const onShowCloseEventPressed = () => {
        if (displayEventsContent?.type === DisplayEventsContentModalEnum.show) {
            setDisplayEventsContent({ type: DisplayEventsContentModalEnum.list });
        } else {
            setDisplayEventsContent(undefined);
        }
    };

    if (isHybrid) {
        return (
            <IonContent>
                <HomeContent
                    onReportPressed={onReportPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    sessions={sessions}
                    news={news}
                    events={events}
                    onShowEventPressed={onShowEventPressed}
                    onShowSessionPressed={onShowSessionPressed}
                    onUpdateSessionPressed={onUpdateSessionPressed}
                    onCreateSessionPressed={onCreateSessionPressed}
                    onShowSessionListPressed={onShowSessionListPressed}
                    onShowNewsPressed={onShowNewsPressed}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile} onRefresh={handleRefresh}>
                <HomeContent
                    isLoading={isLoading}
                    profile={profile}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    tandems={tandems}
                    sessions={sessions}
                    news={news}
                    events={events}
                    onShowEventPressed={onShowEventPressed}
                    onShowSessionPressed={onShowSessionPressed}
                    onUpdateSessionPressed={onUpdateSessionPressed}
                    onCreateSessionPressed={onCreateSessionPressed}
                    onShowSessionListPressed={onShowSessionListPressed}
                    onShowNewsPressed={onShowNewsPressed}
                />
            </OnlineWebLayout>
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
                id={selectedTandem?.id}
                language={selectedTandem?.learningLanguage}
                level={selectedTandem?.level}
                onClose={() => setSelectedTandem(undefined)}
                partnerLearningLanguage={selectedTandem?.partnerLearningLanguage}
                pedagogy={selectedTandem?.pedagogy}
                profile={selectedTandem?.partner}
            />
            <SessionsContentModal
                isVisible={displaySessionModal !== undefined}
                onClose={() => setDisplaySessionModal(undefined)}
                profile={profile}
                tandems={tandems}
                sessions={sessions}
                displaySessionModal={displaySessionModal}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
                onCreateSessionPressed={onCreateSessionPressed}
            />
            <EndSessionModal
                isOpen={isEndSessionModalOpen}
                onClose={() => setIsEndSessionModalOpen(false)}
                onCompleteLearningJournalPressed={onCompleteLearningJournalPressed}
            />
            <NewsContentModal
                isVisible={displayNewsContent !== undefined}
                onClose={onShowCloseNewsPressed}
                onNewsPressed={onShowNewsPressed}
                displayNewsContentModal={displayNewsContent}
                profile={profile}
            />
            <EventsContentModal
                isVisible={displayEventsContent !== undefined}
                onClose={onShowCloseEventPressed}
                onEventPressed={onShowEventPressed}
                displayEventsContentModal={displayEventsContent}
                profile={profile}
            />
        </>
    );
};

export default HomePage;
