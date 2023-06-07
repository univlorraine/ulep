# Keycloak Configuration Guide

1. Initiate login using administrator credentials.

2. Establish a new realm named 'etandem'.

3. Generate a new client, labeled api.

4. Construct client roles:
    - admin: Administrator privileges
    - user: User privileges

5. Design protocol mappers:
    - Navigate: `Client` > `api` > `Client scopes` > `api-dedicated`.
    - Select `Add mapper`.
    - Move to `Add predefined mappers` and choose `client roles`.
    - Modify mapper and activate `add to userinfo`.
