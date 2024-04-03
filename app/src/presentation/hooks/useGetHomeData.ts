import { useState, useEffect } from 'react';
import Tandem from '../../domain/entities/Tandem';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import { LearningType } from '../pages/PairingPedagogyPage';
import University from '../../domain/entities/University';

const useGetHomeData = () => {
    const { getAllTandems, getPartnersToUniversity } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [homeResult, setHomeResult] = useState<{
        tandems: Tandem[];
        partnerUniversities: University[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        tandems: [],
        partnerUniversities: [],
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
            const partnersUniversityResult = await getPartnersToUniversity.execute(profile.user.university.id);
            if (tandemsResult instanceof Error) {
                setHomeResult({ tandems: [], partnerUniversities: [], error: tandemsResult, isLoading: false });
            } else if (partnersUniversityResult instanceof Error) {
                setHomeResult({
                    tandems: [],
                    partnerUniversities: [],
                    error: partnersUniversityResult,
                    isLoading: false,
                });
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
                    partnerUniversities: partnersUniversityResult,
                    error: undefined,
                    isLoading: false,
                });
            }
        };

        fetchData();
    }, [profile]);

    return homeResult;
};

export default useGetHomeData;
