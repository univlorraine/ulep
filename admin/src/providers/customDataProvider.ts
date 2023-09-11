import simpleRestProvider from 'ra-data-simple-rest';
import {
    CreateParams,
    DataProvider,
    DeleteManyParams,
    DeleteParams,
    GetOneParams,
    UpdateParams,
    fetchUtils,
} from 'react-admin';
import { RoutineExecution } from '../entities/RoutineExecution';
import { TandemStatus } from '../entities/Tandem';
import CountriesQuery from '../queries/CountriesQuery';
import InterestsQuery from '../queries/InterestsQuery';
import LanguagesQuery from '../queries/LanguagesQuery';
import { LearningLanguagesQuery, LearningLanguageMatchesQuery } from '../queries/LearningLanguagesQuery';
import ProfilesQuery from '../queries/ProfilesQuery';
import QuestionsQuery from '../queries/QuestionsQuery';
import ReportsQuery from '../queries/ReportsQuery';
import { http } from './authProvider';
import jwtManager from './jwtManager';

const httpClientOptions = (options: any = {}) => {
    const newOptions = options;
    if (!newOptions.headers) {
        newOptions.headers = new Headers({ Accept: 'application/json' });
    }

    if (!(newOptions.body instanceof FormData)) {
        newOptions.headers.set('Content-Type', 'application/json');
    }

    const token = jwtManager.getToken('access_token');
    if (token) {
        newOptions.headers.set('Authorization', `Bearer ${token}`);
    }

    if (localStorage.getItem('locale')) {
        newOptions.headers.set('Language-code', localStorage.getItem('locale'));
    }

    return newOptions;
};

const httpClient = (url: string, options: any = {}) => {
    const newOptions = httpClientOptions(options);

    return fetchUtils.fetchJson(url, newOptions);
};

const dataProvider = simpleRestProvider(`${process.env.REACT_APP_API_URL}`, httpClient);

const customDataProvider: DataProvider = {
    ...dataProvider,
    create: async (resource: string, params: CreateParams) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);
        let body;

        if (params.data instanceof FormData) {
            body = params.data;
        } else {
            body = JSON.stringify(params.data);
        }

        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return { data: result };
    },
    update: async (resource: string, params: UpdateParams) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);
        let body;

        if (params.data instanceof FormData) {
            body = params.data;
        } else {
            body = JSON.stringify(params.data);
        }

        const response = await fetch(url, httpClientOptions({ method: 'PUT', body }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return { data: result };
    },
    getOne: async (resource: string, params: GetOneParams) => {
        let url = new URL(`${process.env.REACT_APP_API_URL}/${resource}/${params.id}`);

        switch (resource) {
            case 'learning-languages/tandems':
                url = new URL(`${process.env.REACT_APP_API_URL}/learning-languages/${params.id}/tandems`);
                break;
            default:
                break;
        }

        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`, {
                cause: response.status,
            });
        }

        const data = await response.json();

        return { data };
    },
    delete: async (resource: string, params: DeleteParams) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}/${params.id}`);

        const response = await fetch(url, httpClientOptions({ method: 'DELETE' }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return { data: params.id };
    },
    deleteMany: async (resource: string, params: DeleteManyParams) => {
        const response = await Promise.all(
            params.ids.map(async (id: string) => {
                const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}/${id}`);

                const result = await fetch(url, httpClientOptions({ method: 'DELETE' }));
                if (!result.ok) {
                    throw new Error(`API request failed with status ${result.status}`);
                }

                return id;
            })
        );

        return { data: response };
    },
    getList: async (resource: string, params: any) => {
        let url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);

        switch (resource) {
            case 'countries':
                url.search = CountriesQuery(params);
                break;
            case 'profiles':
                url.search = ProfilesQuery(params);
                break;
            case 'reports':
                url.search = ReportsQuery(params);
                break;
            case 'proficiency/questions':
                url.search = QuestionsQuery(params);
                break;
            case 'languages':
                url.search = LanguagesQuery(params);
                break;
            case 'interests/categories':
                url.search = InterestsQuery(params);
                break;
            case 'learning-languages':
                url.search = LearningLanguagesQuery(params);
                break;
            case 'learning-languages/matches':
                url = new URL(`${process.env.REACT_APP_API_URL}/learning-languages/${params.filter.id}/matches`);
                url.search = LearningLanguageMatchesQuery(params);
                break;
            default:
                break;
        }
        const response = await fetch(url, httpClientOptions());

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return {
            data: result.items.map(
                // Note: workaround for list items not having IDs (such as learning
                // language matches). Otherwise data is not accessible in useGetList
                (item: any) => ({ ...item, id: item.id || 'no-id' })
            ),
            total: result.totalItems,
        };
    },
    getMany: async (resource: string) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);
        const response = await fetch(url, httpClientOptions());

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return { data: result.items, total: result.totalItems };
    },
    getMatchs: async (profileId: string) => {
        const response = await http(
            'GET',
            `${process.env.REACT_APP_API_URL}/matches?id=${profileId}`,
            httpClientOptions()
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return result.items;
    },
    launchGlobalRoutine: async (universityIds: string[]): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems/generate`;

        const body = JSON.stringify({
            universityIds,
        });
        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    },
    getLastGlobalRoutineExecution: async (): Promise<RoutineExecution> => {
        const url = `${process.env.REACT_APP_API_URL}/routine-executions/last`;

        const response = await fetch(url, httpClientOptions());

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return result;
    },
    validateTandem: async (tandemId: string): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems/${tandemId}/status`;
        const body = JSON.stringify({
            status: TandemStatus.ACTIVE,
        });
        const response = await fetch(url, httpClientOptions({ method: 'PUT', body }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    },
    createTandem: async (learningLanguageIds: string[]): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems`;
        const body = JSON.stringify({
            learningLanguageIds,
            status: TandemStatus.ACTIVE,
        });
        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
    },
};

export default customDataProvider;
