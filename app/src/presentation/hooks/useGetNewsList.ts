import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import News from '../../domain/entities/News';
import { useStoreState } from '../../store/storeTypes';

const useGetNewsList = () => {
    const { getAllNews } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const [newsResult, setNewsResult] = useState<{
        news: News[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        news: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile)
        return {
            ...newsResult,
            searchTitle: '',
            setSearchTitle: () => {},
        };

    useEffect(() => {
        const fetchData = async () => {
            setNewsResult({
                ...newsResult,
                isLoading: true,
            });
            const result = await getAllNews.execute({
                title: searchTitle,
                universityId: profile.user.university.id,
                page,
            });
            if (result instanceof Error) {
                return setNewsResult({
                    ...newsResult,
                    news: [],
                    error: result,
                    isLoading: false,
                });
            }

            setNewsResult({
                ...newsResult,
                news: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [page, searchTitle]);

    return { ...newsResult, searchTitle, setSearchTitle };
};

export default useGetNewsList;
