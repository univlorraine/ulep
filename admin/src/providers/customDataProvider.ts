import simpleRestProvider from 'ra-data-simple-rest';
import {
    CreateParams,
    DataProvider,
    DeleteManyParams,
    DeleteParams,
    GetOneParams,
    HttpError,
    UpdateParams,
    addRefreshAuthToDataProvider,
    fetchUtils,
} from 'react-admin';
import Language from '../entities/Language';
import { RoutineExecution } from '../entities/RoutineExecution';
import { TandemStatus } from '../entities/Tandem';
import AdministratorsQuery from '../queries/AdministratorsQuery';
import CountriesQuery from '../queries/CountriesQuery';
import InterestsQuery from '../queries/InterestsQuery';
import LanguagesQuery from '../queries/LanguagesQuery';
import { LearningLanguagesQuery, LearningLanguageMatchesQuery } from '../queries/LearningLanguagesQuery';
import ProfilesQuery from '../queries/ProfilesQuery';
import QuestionsQuery from '../queries/QuestionsQuery';
import ReportsQuery from '../queries/ReportsQuery';
import { http, refreshAuth } from './authProvider';
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

const throwError = async (response: Response) => {
    if (response.status === 401) {
        return Promise.reject(new HttpError('Forbidden', response.status));
    }

    const data = await response.json();
    if (data.message) {
        throw new Error(data.message, { cause: response.status });
    } else {
        throw new Error(`API request failed with status ${response.status}`, { cause: response.status });
    }
};

const httpClient = (url: string, options: any = {}) => {
    const newOptions = httpClientOptions(options);

    return fetchUtils.fetchJson(url, newOptions);
};

const dataProvider = simpleRestProvider(`${process.env.REACT_APP_API_URL}`, httpClient);

const customDataProvider = {
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
            await throwError(response);
        }

        const result = await response.json();

        return { data: result };
    },
    update: async (resource: string, params: UpdateParams) => {
        let url = `${process.env.REACT_APP_API_URL}/${resource}`;
        if (params.id) {
            url += `/${params.id}`;
        }
        let body;

        if (params.data instanceof FormData) {
            body = params.data;
        } else {
            body = JSON.stringify(params.data);
        }

        const method = resource === 'users' ? 'POST' : 'PUT';
        const response = await fetch(new URL(url), httpClientOptions({ method, body }));

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        if (resource === 'instance') {
            return { data: { ...result, id: 'config' } };
        }

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
            await throwError(response);
        }

        const data = await response.json();

        if (resource === 'instance') {
            return { data: { ...data, id: 'config' } };
        }

        return { data };
    },
    delete: async (resource: string, params: DeleteParams) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}/${params.id}`);

        const response = await fetch(url, httpClientOptions({ method: 'DELETE' }));

        if (!response.ok) {
            await throwError(response);
        }

        return { data: params.id };
    },
    deleteMany: async (resource: string, params: DeleteManyParams) => {
        const response = await Promise.all(
            params.ids.map(async (id: string) => {
                const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}/${id}`);

                const result = await fetch(url, httpClientOptions({ method: 'DELETE' }));
                if (!result.ok) {
                    await throwError(result);
                }

                return id;
            })
        );

        return { data: response };
    },
    getList: async (resource: string, params: any) => {
        let url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);

        switch (resource) {
            case 'users/administrators':
                url.search = AdministratorsQuery(params);
                break;
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
            await throwError(response);
        }

        const result = await response.json();

        if (resource === 'languages') {
            return {
                data: result.items.map((language: Language) => ({
                    ...language,
                    name: `languages_code.${language.code}`,
                })),
                total: result.totalItems,
            };
        }

        if (!result.items) {
            return { data: result, total: result.length };
        }

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
            await throwError(response);
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
            await throwError(response);
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
            await throwError(response);
        }
    },
    getLastGlobalRoutineExecution: async (): Promise<RoutineExecution> => {
        const url = `${process.env.REACT_APP_API_URL}/routine-executions/last`;

        const response = await fetch(url, httpClientOptions());

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        return result;
    },
    validateTandem: async (tandemId: string, relaunchGlobalRoutine?: boolean): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems/${tandemId}/validate`;
        const body = JSON.stringify({
            relaunch: !!relaunchGlobalRoutine,
        });
        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            await throwError(response);
        }
    },
    createTandem: async (learningLanguageIds: string[], relaunchGlobalRoutine?: boolean): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems`;
        const body = JSON.stringify({
            learningLanguageIds,
            relaunch: !!relaunchGlobalRoutine,
        });
        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            await throwError(response);
        }
    },
    updateTandem: async (tandemId: string, tandemStatus: TandemStatus): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems/${tandemId}`;
        const body = JSON.stringify({
            status: tandemStatus,
        });
        const response = await fetch(url, httpClientOptions({ method: 'PUT', body }));

        if (!response.ok) {
            await throwError(response);
        }
    },
    refuseTandem: async (learningLanguageIds: string[], relaunchGlobalRoutine?: boolean): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/tandems/refuse`;
        const body = JSON.stringify({
            learningLanguageIds,
            relaunch: !!relaunchGlobalRoutine,
        });
        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            await throwError(response);
        }
    },
    purge: async (): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/purges`;
        const response = await fetch(url, httpClientOptions({ method: 'POST' }));

        if (!response.ok) {
            await throwError(response);
        }
    },
    exportUserPersonalData: async (userId: string): Promise<Response> => {
        const url = `${process.env.REACT_APP_API_URL}/users/${userId}/export`;
        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        return response;
    },
    getKeycloackGroups: async () => {
        const url = `${process.env.REACT_APP_API_URL}/users/groups`;
        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        return result;
    },
} as unknown as DataProvider;

export default addRefreshAuthToDataProvider(customDataProvider, refreshAuth);
