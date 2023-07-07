import simpleRestProvider from 'ra-data-simple-rest';
import { fetchUtils } from 'react-admin';
import { http } from './authProvider';
import jwtManager from './jwtManager';

interface Params {
    filter: {
        email: string,
    },
    pagination: {
      page: string;
      perPage: string;
    };
  }

const httpClient = (url: string, options: any = {}) => {
    const newOptions = options;
    if (!newOptions.headers) {
        newOptions.headers = new Headers({ Accept: 'application/json' });
    }
    const token = jwtManager.getToken();

    if (token) {
        newOptions.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, newOptions);
};

const dataProvider = simpleRestProvider(`${process.env.REACT_APP_API_URL}`, httpClient);

const customDataProvider = {
    ...dataProvider,
    getList: async (resource: string, params: Params) => {
        const url = new URL(`${process.env.REACT_APP_API_URL}/${resource}`);

        if (params.pagination.page) {
            url.searchParams.append('page', params.pagination.page);
        }

        if (params.pagination.perPage) {
            url.searchParams.append('limit', params.pagination.perPage);
        }

        if (params.filter.email) {
            url.searchParams.append('filter', params.filter.email);
        }
        const response = await fetch(url);

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
            {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtManager.getToken()}` },

            },
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        return result.items;
    },
};

export default customDataProvider;
