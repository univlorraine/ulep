import { KeycloakClient, KeycloakConfiguration } from '@app/keycloak';

const jsonResponse = (status: number, body: unknown) =>
  ({
    ok: status < 400,
    status,
    json: async () => body,
  }) as Response;

describe('KeycloakClient.removeUserFromAdminGroups', () => {
  const originalFetch = global.fetch;
  const usersUrl = 'http://keycloak/admin/realms/etandem/users';

  let deletedGroups: string[];
  let client: KeycloakClient;

  beforeEach(() => {
    deletedGroups = [];

    global.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? 'GET';

        if (method === 'GET' && url === `${usersUrl}/user-id/groups`) {
          return jsonResponse(200, [
            { id: 'manager-group-id', name: 'Manager' },
            { id: 'animator-group-id', name: 'Animator' },
            { id: 'api-user-group-id', name: 'External-api-user' },
          ]);
        }
        if (
          method === 'DELETE' &&
          url.startsWith(`${usersUrl}/user-id/groups/`)
        ) {
          deletedGroups.push(url.split('/').pop());
          return jsonResponse(204, undefined);
        }

        return jsonResponse(404, { error: `Unexpected call ${method} ${url}` });
      },
    ) as typeof fetch;

    client = new KeycloakClient({
      baseUrl: 'http://keycloak',
      realm: 'etandem',
    } as KeycloakConfiguration);
    jest.spyOn(client, 'getAccessToken').mockResolvedValue('token');
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('Should remove the user from every admin group and keep the other groups', async () => {
    await client.removeUserFromAdminGroups('user-id');

    expect(deletedGroups.sort()).toEqual([
      'animator-group-id',
      'manager-group-id',
    ]);
  });
});
