import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import News from '../../domain/entities/News';
import { DEFAULT_NEWS_PAGE_SIZE } from '../../domain/interfaces/news/GetAllNewsUsecase.interface';
import { useStoreState } from '../../store/storeTypes';

const useGetNewsList = (languageFilter: Language[]) => {
    const { getAllNews } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [isNewsListEnded, setIsNewsListEnded] = useState<boolean>(false);
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
            isNewsListEnded,
            setSearchTitle: () => {},
            onLoadMoreNews: () => {},
        };

    const onLoadMoreNews = () => {
        setPage(page + 1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setNewsResult({
                ...newsResult,
                isLoading: true,
            });
            const result = await getAllNews.execute({
                title: searchTitle,
                page,
                languageCodes: languageFilter.map((language) => language.code),
            });
            if (result instanceof Error) {
                return setNewsResult({
                    ...newsResult,
                    news: [],
                    error: result,
                    isLoading: false,
                });
            }

            if (result.length < DEFAULT_NEWS_PAGE_SIZE) {
                setIsNewsListEnded(true);
            }

            setNewsResult({
                ...newsResult,
                news: [...newsResult.news, ...result],
                error: undefined,
                isLoading: false,
            });
        };

        if (page !== 1) {
            fetchData();
        }
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            setNewsResult({
                ...newsResult,
                isLoading: true,
            });
            const result = await getAllNews.execute({
                title: searchTitle,
                page: 1,
                languageCodes: languageFilter.map((language) => language.code),
            });
            if (result instanceof Error) {
                return setNewsResult({
                    ...newsResult,
                    news: [],
                    error: result,
                    isLoading: false,
                });
            }

            if (result.length < DEFAULT_NEWS_PAGE_SIZE) {
                setIsNewsListEnded(true);
            } else {
                setIsNewsListEnded(false);
            }
            setPage(1);
            setNewsResult({
                ...newsResult,
                news: result,
                error: undefined,
                isLoading: false,
            });
        };

        fetchData();
    }, [searchTitle, languageFilter]);

    return { ...newsResult, searchTitle, setSearchTitle, isNewsListEnded, onLoadMoreNews };
};

export default useGetNewsList;
