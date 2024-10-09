import { useEffect, useState } from 'react';
import { useGetList } from 'react-admin';
import University from '../../entities/University';

const useGetUniversitiesLanguages = () => {
    const { data: universitiesData } = useGetList<University>('universities');
    const [universitiesLanguages, setUniversitiesLanguages] = useState<string[]>([]);

    useEffect(() => {
        if (universitiesData) {
            const languages = new Set<string>(['en']);
            universitiesData.forEach((university: University) => {
                languages.add(university.nativeLanguage.code);
                if (university.specificLanguagesAvailable) {
                    university.specificLanguagesAvailable.forEach((specificLanguage) => {
                        languages.add(specificLanguage.code);
                    });
                }
            });
            setUniversitiesLanguages(Array.from(languages));
        }
    }, [universitiesData]);

    return universitiesLanguages;
};

export default useGetUniversitiesLanguages;
