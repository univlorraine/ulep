import { KeycloakClient, KeycloakConfiguration } from '@app/keycloak';

const jsonResponse = (status: number, body: unknown) =>
  ({
    ok: status < 400,
    status,
    json: async () => body,
  }) as Response;

describe('KeycloakClient.updateUser', () => {
  const originalFetch = global.fetch;
  const usersUrl = 'http://keycloak/admin/realms/etandem/users';

  const existingUser = {
    id: 'user-id',
    email: 'felipe.brouardo@uam.es',
    firstName: 'Felipe',
    lastName: 'Brouardo',
    attributes: {
      origin: ['api'],
      universityId: ['university-id'],
      languageId: ['language-id'],
    },
  };

  let sentPayload: Record<string, any> | undefined;
  let client: KeycloakClient;

  beforeEach(() => {
    sentPayload = undefined;

    global.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? 'GET';

        if (method === 'PUT' && url === `${usersUrl}/user-id`) {
          sentPayload = JSON.parse(init.body as string);
          return jsonResponse(204, undefined);
        }
        if (method === 'GET' && url === `${usersUrl}/user-id`) {
          return jsonResponse(200, existingUser);
        }
        if (method === 'GET' && url === `${usersUrl}/user-id/groups`) {
          return jsonResponse(200, []);
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

  it('Should keep the existing attributes when only the name changes', async () => {
    await client.updateUser({
      id: 'user-id',
      newFirstName: 'Felipe',
      newLastName: 'Brouardo-Garcia',
      newEmail: 'felipe.brouardo@uam.es',
    });

    expect(sentPayload?.lastName).toBe('Brouardo-Garcia');
    expect(sentPayload?.attributes).toEqual({
      origin: ['api'],
      universityId: ['university-id'],
      languageId: ['language-id'],
    });
  });

  it('Should only overwrite the attributes it is given', async () => {
    await client.updateUser({
      id: 'user-id',
      newEmail: 'felipe.brouardo@uam.es',
      universityId: 'other-university-id',
    });

    expect(sentPayload?.attributes).toEqual({
      origin: ['api'],
      universityId: ['other-university-id'],
      languageId: ['language-id'],
    });
  });
});
