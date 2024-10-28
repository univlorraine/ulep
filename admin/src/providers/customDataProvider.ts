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
import { MessageType } from '../entities/Message';
import { CONVERSATION_CATEGORY } from '../entities/Report';
import { RoutineExecution } from '../entities/RoutineExecution';
import { TandemStatus } from '../entities/Tandem';
import User from '../entities/User';
import ActivitiesCategoriesQuery from '../queries/ActivitiesCategoriesQuery';
import ActivitiesQuery from '../queries/ActivitiesQuery';
import AdministratorsQuery from '../queries/AdministratorsQuery';
import ChatQuery from '../queries/ChatQuery';
import CountriesQuery from '../queries/CountriesQuery';
import InterestsQuery from '../queries/InterestsQuery';
import LanguagesQuery from '../queries/LanguagesQuery';
import { LearningLanguageMatchesQuery, LearningLanguagesQuery } from '../queries/LearningLanguagesQuery';
import NewsQuery from '../queries/NewsQuery';
import ProfilesQuery from '../queries/ProfilesQuery';
import ProfilesWithTandemsQuery from '../queries/ProfilesWithTandemsQuery';
import QuestionsQuery from '../queries/QuestionsQuery';
import ReportsQuery from '../queries/ReportsQuery';
import UniversitiesQuery from '../queries/UniversitiesQuery';
import { http, refreshAuth } from './authProvider';
import jwtManager from './jwtManager';
import SocketIoProvider from './socketIoProvider';

let socketIoProviderInstance: SocketIoProvider | null = null;

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

        let method = 'PUT';

        switch (resource) {
            case 'users':
                method = 'POST';
                break;
            case 'activities':
                method = 'POST';
                url = `${process.env.REACT_APP_API_URL}/activities/${params.id}/update`;
                break;
            case 'activities/status':
                url = `${process.env.REACT_APP_API_URL}/activities/${params.id}/status`;
                break;
            default:
                break;
        }

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
            case 'chat':
                url = new URL(`${process.env.REACT_APP_API_URL}/chat/messages/${params.id}`);
                break;
            default:
                break;
        }

        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        const data = await response.json();

        switch (resource) {
            case 'instance':
                return { data: { ...data, id: 'config' } };
            case 'chat':
                return { data: { ...data, id: params.id } };
            default:
                break;
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
            case 'activities':
                url = new URL(`${process.env.REACT_APP_API_URL}/activities/admin`);
                url.search = ActivitiesQuery(params);
                break;
            case 'activities/categories':
                url.search = ActivitiesCategoriesQuery(params);
                break;
            case 'users/administrators':
                url.search = AdministratorsQuery(params);
                break;
            case 'chat':
                url = new URL(`${process.env.REACT_APP_API_URL}/chat/${params.filter.id}`);
                url.search = ChatQuery(params);
                break;
            case 'chat/messages':
                url = new URL(`${process.env.REACT_APP_API_URL}/chat/messages/${params.filter.conversationId}`);
                break;
            case 'countries':
                url.search = CountriesQuery(params);
                break;
            case 'profiles':
                url.search = ProfilesQuery(params);
                break;
            case 'profiles/with-tandems-profiles':
                url.search = ProfilesWithTandemsQuery(params);
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
            case 'news':
                url = new URL(`${process.env.REACT_APP_API_URL}/news/admin`);
                url.search = NewsQuery(params);
                break;
            case 'universities':
                url.search = UniversitiesQuery(params);
                break;
            default:
                break;
        }
        const response = await fetch(url, httpClientOptions());

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        if (resource === 'chat') {
            const conversationsWithPartner = result.items.map((conversation: any) => {
                const partner = conversation.users.find((user: User) => user.id !== params.filter.id);

                return { ...conversation, partner };
            });

            return { data: conversationsWithPartner, total: result.totalItems };
        }

        if (resource === 'reports/categories') {
            // Category "Conversation" should not be edited, so it is made invisible
            const categoriesWithoutConversation = result.items.filter(
                (category: any) => category.name !== CONVERSATION_CATEGORY
            );

            return { data: categoriesWithoutConversation, total: result.totalItems };
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
    generateConversations: async (): Promise<void> => {
        const url = `${process.env.REACT_APP_API_URL}/chat/generate-conversation`;
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
    getKeycloackAdminGroups: async () => {
        const url = `${process.env.REACT_APP_API_URL}/users/admin/groups`;
        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        return result;
    },
    getChatMessagesByConversationId: async ({
        conversationId,
        lastMessageId,
        direction,
        limit = 10,
        typeFilter,
    }: {
        conversationId: string;
        lastMessageId?: string;
        direction?: 'forward' | 'backward';
        limit?: number;
        typeFilter?: MessageType;
    }): Promise<any> => {
        const url = `${process.env.REACT_APP_API_URL}/chat/messages/${conversationId}?limit=${limit}${
            lastMessageId ? `&lastMessageId=${lastMessageId}` : ''
        }${direction ? `&direction=${direction}` : ''}${typeFilter ? `&typeFilter=${typeFilter}` : ''}`;
        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        return result.items;
    },
    getSocketIoProvider: (): SocketIoProvider | null => {
        const socketUrl = process.env.REACT_APP_SOCKET_CHAT_URL;
        if (!socketIoProviderInstance && socketUrl) {
            socketIoProviderInstance = new SocketIoProvider(socketUrl);
        }

        return socketIoProviderInstance;
    },
    sendMessage: async (
        conversationId: string,
        senderId: string,
        content?: string,
        file?: File,
        filename?: string
    ): Promise<any> => {
        const url = `${process.env.REACT_APP_CHAT_URL}/conversations/${conversationId}/message`;
        const body = new FormData();
        body.append('senderId', senderId);

        if (content) {
            body.append('content', content);
        }
        if (file) {
            body.append('file', file);
        }
        if (filename) {
            body.append('filename', filename);
        }

        const response = await fetch(url, httpClientOptions({ method: 'POST', body }));

        if (!response.ok) {
            await throwError(response);
        }

        const result = await response.json();

        return { data: result };
    },
    getJitsiToken: async (): Promise<string> => {
        const url = `${process.env.REACT_APP_API_URL}/authentication/jitsi/token`;
        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        return response.json();
    },
    getUniversityDivisions: async (universityId: string): Promise<string[]> => {
        const url = `${process.env.REACT_APP_API_URL}/universities/${universityId}/divisions`;
        const response = await fetch(url, httpClientOptions({ method: 'GET' }));

        if (!response.ok) {
            await throwError(response);
        }

        return response.json();
    },
} as unknown as DataProvider;

export default addRefreshAuthToDataProvider(customDataProvider, refreshAuth);
