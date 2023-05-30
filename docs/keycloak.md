Keycloak does offer a full OpenID Connect implementation. To set up, please take the following steps:

1. Create a new Keycloak client in the Clients section:

    a. Choose the `Client ID` in the `General Settings` pane.

    b. Select `Client authentication` and `Authorization` in the
        `Capability config` pane.

2. Configure the following parameters in the Client setup:

    Settings >
        Client ID (copy to settings as `KEY` value)
    Credentials >
        Client Authenticator >
            Use `Client Id and Secret` and copy the `Client secret` value
            to settings as `SECRET` value

3. For the tokens to work with the JWT setup the following configuration has
    to be made in Keycloak:

    Advanced >
        Fine grain OpenID Connect configuration >
            User Info Signed Response Algorithm >
                RS256
    Advanced >
        Fine grain OpenID Connect configuration >
            Request Object Signature Algorithm >
                RS256

4. Re-enable the audience (see https://issues.redhat.com/browse/KEYCLOAK-6638 for context):

    Go to Client scopes > YOUR-CLIENT-ID-dedicated > Add mapper > Audience, pick
    a name for the mapper and select the Client ID corresponding to your client
    in `Included Client Audience`.

5. Get the public key (copy to settings as `PUBLIC_KEY` value) to be used
    with the backend:

    Realm Settings > Keys > Public key

6. Configure access token fields are configured via the Keycloak Client
    mappers:

    Clients > Client ID > Mappers

They have to include at least the `ID_KEY` value and the dictionary keys
defined in the `get_user_details` method.

7. Configure your web backend. 
    SOCIAL_AUTH_KEYCLOAK_KEY = 'example'
    SOCIAL_AUTH_KEYCLOAK_SECRET = '1234abcd-1234-abcd-1234-abcd1234adcd'
    SOCIAL_AUTH_KEYCLOAK_PUBLIC_KEY = \
        'pempublickeythatis2048bitsinbase64andhaseg392characters'
    SOCIAL_AUTH_KEYCLOAK_AUTHORIZATION_URL = \
        'https://sso.com/auth/realms/example/protocol/openid-connect/auth'
    SOCIAL_AUTH_KEYCLOAK_ACCESS_TOKEN_URL = \
        'https://sso.com/auth/realms/example/protocol/openid-connect/token'

8. The default behaviour is to associate users via username field, but you
    can change the key with e.g.

        SOCIAL_AUTH_KEYCLOAK_ID_KEY = 'email'

Please make sure your Keycloak user database and Django user database do not
conflict and that there is no risk of user account hijacking by false
account association.