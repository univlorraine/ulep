import { useGetList } from 'react-admin';
import Language from '../../entities/Language';

const useGetLanguages = () => {
    const { data: primaryLanguages } = useGetList<Language>('languages', {
        filter: {
            status: 'PRIMARY',
        },
    });
    const { data: suggestedLanguages } = useGetList<Language>('languages', {
        filter: {
            status: 'SECONDARY',
        },
    });
    const { data: partnerLanguages } = useGetList<Language>('languages', {
        filter: {
            status: 'PARTNER',
        },
    });

    return {
        primaryLanguages: primaryLanguages?.map((language) => language.code) || [],
        suggestedLanguages: suggestedLanguages?.map((language) => language.code) || [],
        partnerLanguages: partnerLanguages?.map((language) => language.code) || [],
    };
};

export default useGetLanguages;
