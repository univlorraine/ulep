import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import { LearningType } from '../pages/PairingPedagogyPage';

const useGetLearningData = () => {
    const { getAllTandems } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [learningResult, setLearningResult] = useState<{
        tandems: Tandem[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        tandems: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return learningResult;

    useEffect(() => {
        const fetchData = async () => {
            setLearningResult({
                ...learningResult,
                isLoading: true,
            });
            const tandemsResult = await getAllTandems.execute(profile.id);
            if (tandemsResult instanceof Error) {
                return setLearningResult({ tandems: [], error: tandemsResult, isLoading: false });
            }

            const waitingLearningLanguages: Tandem[] = [];
            profile?.learningLanguages.map((learningLanguage) => {
                if (!tandemsResult.find((tandem) => tandem.learningLanguage.id === learningLanguage.id)) {
                    waitingLearningLanguages.push(
                        new Tandem(
                            learningLanguage.id,
                            'DRAFT',
                            learningLanguage,
                            learningLanguage,
                            learningLanguage.level,
                            LearningType.TANDEM
                        )
                    );
                }
            });

            setLearningResult({
                tandems: [...tandemsResult, ...waitingLearningLanguages],
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [profile]);

    return learningResult;
};

export default useGetLearningData;
