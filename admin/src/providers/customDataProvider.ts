import simpleRestProvider from 'ra-data-simple-rest';
import { fetchUtils } from 'react-admin';
import CountriesQuery from '../queries/CountriesQuery';
import ProfilesQuery from '../queries/ProfilesQuery';
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

const customDataProvider = {
    ...dataProvider,
    create: async (resource: string, params: any) => {
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
    delete: async (resource: string, params: any) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}/${params.id}`);

        const response = await fetch(url, httpClientOptions({ method: 'DELETE' }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return { data: params.id };
    },
    deleteMany: async (resource: string, params: any) => {
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
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);

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
            default:
                break;
        }
        const response = await fetch(url, httpClientOptions());

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return { data: result.items, total: result.totalItems };
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
};

export default customDataProvider;
