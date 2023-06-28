# eTandems

TODO: Put a short description of the project here.

## Features

TODO: List what the project can do. Maybe include images, gifs, or videos.

## Getting started

TODO: List prerequisites and provide or point to information on how to start using the project.

## Installation

You can use this project with Docker. Simply go to the project directory and run the following commands on your CLI:

```bash
docker compose build --pull --no-cache
```

```bash
docker compose up --detach
```

This will build and run the project on your localhost. You now have access to the following services:

- [Admin](http://localhost:3001)
- [Api](http://localhost:3000)
- [Keycloak](http://localhost:8080)
- [Minio](http://localhost:9000)

## Keycloak

1. Setting up Keycloak

Open Keycloak by navigating to http://localhost:8080 in your browser. You'll be redirected to the administration console where you'll log in with the admin user.

Now create a realm. A realm in Keycloak is the equivalent of a tenant. It allows creating isolated spaces where applications, users, roles, and groups exist. From the Master drop-down list, click on Add realm.
Give your realm a name and click Create.

Next, create a client. Clients in Keycloak are entities that can request Keycloak to authenticate a user. Go to Clients -> Create, fill in the necessary details, and save.

2. User and Role Creation

You'll need at least one user to test the authentication. Go to Users -> Add user, provide the details and credentials, and click Save.

You might also need roles, which can be added from Roles -> Add Role. Once created, you can assign roles to a user from the user's detail page.

## Additional information

TODO: Tell users more about the project: where to find more information, how to contribute, how to file issues, what response they can expect
from the authors, and more.
