import { useState, useEffect } from 'react';
import Tandem from '../../domain/entities/Tandem';
import Profile from '../../domain/entities/Profile';
import { useConfig } from '../../context/ConfigurationContext';

interface useGetTandemsProps {
    profile?: Profile;
    showToast: (payload: {message: string, duration: number}) => void;
    t: (key: string) => string;
}

const useGetTandems = ({profile, showToast, t}: useGetTandemsProps, deps: any[]) => {
    const [tandems, setTandems] = useState<Tandem[]>([]);
    const { getAllTandems } = useConfig();

    useEffect(() => {
        const getHomeData = async () => {
            const result = await getAllTandems.execute(profile!.id);

            if (result instanceof Error) {
                return await showToast({ message: t(result.message), duration: 5000 });
            }

            const waitingLearningLanguages: Tandem[] = [];
            profile?.learningLanguages.map((learningLanguage) => {
                if (!result.find((tandem) => tandem.learningLanguage.id === learningLanguage.id)) {
                    waitingLearningLanguages.push(new Tandem(learningLanguage.id, 'DRAFT', learningLanguage, 'A0', 'TANDEM'));
                }
            });

            setTandems([...result, ...waitingLearningLanguages]);
        };

        getHomeData();
    }, [profile, showToast, t, ...deps]);

    return tandems;
};

export default useGetTandems;
