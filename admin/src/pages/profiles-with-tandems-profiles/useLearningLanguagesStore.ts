import { useStore } from 'react-admin';

const STORE_KEY = 'universityIdsTest';

const useLearningLanguagesStore = () => {
    const [selectedUniversityIds, setSelectedUniversityIds] = useStore<string[]>(STORE_KEY, []);

    return { selectedUniversityIds, setSelectedUniversityIds };
};

export default useLearningLanguagesStore;
