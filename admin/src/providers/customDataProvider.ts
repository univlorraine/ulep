import simpleRestProvider from 'ra-data-simple-rest';
import { httpClient } from './authProvider';

interface Params {
    filter: {
        email: string,
    },
    pagination: {
      page: string;
      perPage: string;
    };
  }

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

        return { data: result.items, total: result.total };
    },
};

export default customDataProvider;
