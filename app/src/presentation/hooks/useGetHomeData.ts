import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import { LearningType } from '../pages/PairingPedagogyPage';

const useGetHomeData = (refresh?: boolean) => {
    const { getAllTandems } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [homeResult, setHomeResult] = useState<{
        tandems: Tandem[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        tandems: [],
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
            if (tandemsResult instanceof Error) {
                setHomeResult({ tandems: [], error: tandemsResult, isLoading: false });
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
