import { useState, useEffect } from 'react';
import Tandem from '../../domain/entities/Tandem';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import { LearningType } from '../pages/PairingPedagogyPage';

const useGetTandems = () => {
    const { getAllTandems } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [tandemsResult, setTandemsResult] = useState<{ tandems: Tandem[]; error: Error | undefined, isLoading: boolean }>({
        tandems: [],
        error: undefined,
        isLoading: false
    });

    if (!profile) return tandemsResult;

    useEffect(() => {
        const fetchData = async () => {
            setTandemsResult({
                ...tandemsResult,
                isLoading: true,
            });
            const result = await getAllTandems.execute(profile.id);
            if (result instanceof Error) {
                setTandemsResult({ tandems: [], error: result, isLoading: false });
            } else {
                const waitingLearningLanguages: Tandem[] = [];
                profile?.learningLanguages.map((learningLanguage) => {
                    if (!result.find((tandem) => tandem.learningLanguage.id === learningLanguage.id)) {
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
                setTandemsResult({ tandems: [...result, ...waitingLearningLanguages], error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [profile]);

    return tandemsResult;
};

export default useGetTandems;
