import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import EventObject from '../../domain/entities/Event';
import News from '../../domain/entities/News';
import Session from '../../domain/entities/Session';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import { LearningType } from '../pages/PairingPedagogyPage';

const useGetHomeData = (refresh?: boolean) => {
    const { getAllTandems, getAllSessions, getAllNews, getAllEvents } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [homeResult, setHomeResult] = useState<{
        tandems: Tandem[];
        sessions: Session[];
        news: News[];
        events: EventObject[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        tandems: [],
        sessions: [],
        news: [],
        events: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return homeResult;

    useEffect(() => {
        const fetchData = async () => {
            setHomeResult({
                ...homeResult,
                isLoading: true,
            });
            const tandemsResult = await getAllTandems.execute(profile.id);
            const sessionsResult = await getAllSessions.execute(profile.id);
            const newsResult = await getAllNews.execute({
                limit: 3,
                page: 1,
            });
            const eventsResult = await getAllEvents.execute({
                limit: 3,
                page: 1,
            });
            if (tandemsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: tandemsResult, isLoading: false });
            } else if (sessionsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: sessionsResult, isLoading: false });
            } else if (newsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: newsResult, isLoading: false });
            } else if (eventsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: eventsResult, isLoading: false });
            } else {
                const waitingLearningLanguages: Tandem[] = [];
                profile?.learningLanguages.map((learningLanguage) => {
                    if (!tandemsResult.find((tandem) => tandem.learningLanguage.id === learningLanguage.id)) {
                        // TODO(futur) : Change this logic to get it from api ?
                        waitingLearningLanguages.push(
                            new Tandem(
                                learningLanguage.id,
                                'DRAFT',
                                learningLanguage,
                                learningLanguage,
                                'A0',
                                LearningType.TANDEM
                            )
                        );
                    }
                });
                setHomeResult({
                    tandems: [...tandemsResult, ...waitingLearningLanguages],
                    sessions: sessionsResult,
                    news: newsResult,
                    events: eventsResult,
                    error: undefined,
                    isLoading: false,
                });
            }
        };

        fetchData();
    }, [profile, refresh]);

    return homeResult;
};

export default useGetHomeData;
