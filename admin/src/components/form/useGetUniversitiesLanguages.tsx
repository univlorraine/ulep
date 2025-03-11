import { useEffect, useState } from 'react';
import { useGetList } from 'react-admin';
import Language from '../../entities/Language';
import University from '../../entities/University';

const useGetUniversitiesLanguages = () => {
    const { data: universitiesData } = useGetList<University>('universities', {
        sort: { field: 'name', order: 'ASC' },
    });
    const [universitiesLanguages, setUniversitiesLanguages] = useState<Language[]>([]);

    useEffect(() => {
        if (universitiesData) {
            const languages: Language[] = [];
            universitiesData.forEach((university: University) => {
                if (!languages.some((lang) => lang.code === university.nativeLanguage.code)) {
                    languages.push(university.nativeLanguage);
                }
                if (university.specificLanguagesAvailable) {
                    university.specificLanguagesAvailable.forEach((specificLanguage) => {
                        if (!languages.some((lang) => lang.code === specificLanguage.code)) {
                            languages.push(specificLanguage);
                        }
                    });
                }
            });
            setUniversitiesLanguages(Array.from(languages));
        }
    }, [universitiesData]);

    return { universitiesLanguages, universitiesData };
};

export default useGetUniversitiesLanguages;
