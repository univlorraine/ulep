---
title: Utilisation de l'api de récupération des journaux d'activités
---
# Utilisation de l'api de récupération des journaux d'activités

## Création des groupes Keycloak 

Deux groupes Keycloak doivent être crée :

* External-api-admin : étant le groupe permettant de récupérer les journaux d'activité peu importe l'état de partage des journaux.
* External-api-user : étant le groupe permettant de récupérer les journaux d'activité partagés.

## Création d'un compte Keycloak

Pour pouvoir utiliser l'API, il faudra crée un compte keycloak avec comme groupe l'un des deux cités ci-dessus.

## Récupération du token

Avant d'appeler l'API, il faudra récupérer le token grâce à cette requête:

```bash
curl 'http://<api host>/authentication/token' --data-raw '{"email":"email crée precedemment","password":"mot de passe associés"}'
```

Le token sera contenu dans le retour :

```json
{"accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlNHFYQnRodXB4UTBGTU5USnA4MnBjOEtkaU4weFVHWVR6dkVqcXhuVnQ4In0.eyJleHAiOjE3NDcwNjAwOTQsImlhdCI6MTc0NzA1ODI5NCwianRpIjoiYWM1ODIwNzAtNzMyNi00NmZjLTgxNmItODAwZTIyMjU5YTNlIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnVsZXAudGhlc3RhZ2luZy5pby9yZWFsbXMvZXRhbmRlbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyODY1MjExOC00ZjM4LTQyN2ItOWE1Zi05YjEyMGY2ZTVjNzUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhcGkiLCJzaWQiOiI3MzM4MWNjNC01OTRkLTRkMDYtYTNlNy1mZDEwN2E2YzI2MjYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vYWRtaW4udWxlcC50aGVzdGFnaW5nLmlvIiwiaHR0cHM6Ly9qaXRzaS10ZXN0LnVsZXAudGhlc3RhZ2luZy5pby8iLCJodHRwczovL3dlYmFwcC51bGVwLnRoZXN0YWdpbmcuaW8iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZXRhbmRlbSIsIm9mZmxpbmVfYWNjZXNzIiwic3VwZXItYWRtaW4iLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSBvZmZsaW5lX2FjY2VzcyIsInVuaXZlcnNpdHlJZCI6ImI1MTFmOWQxLWNlN2UtNDBiNS1hNjMwLWVjYjk5ZjRlOWY1OSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiTWF0dGhpZXUgQ2hhdWxldCIsInByZWZlcnJlZF91c2VybmFtZSI6Im1hdHRoaWV1LmNoYXVsZXRAdGhldHJpYmUuaW8iLCJnaXZlbl9uYW1lIjoiTWF0dGhpZXUiLCJmYW1pbHlfbmFtZSI6IkNoYXVsZXQiLCJlbWFpbCI6Im1hdHRoaWV1LmNoYXVsZXRAdGhldHJpYmUuaW8ifQ.NZ8H9fts0q2iZna4MdEbVHhUFvfXaU2dsHAtkgM7KFPcszfkz9mUnL3wnlE1cZRL0O0RLxddoO5Z9wsX9u6LBNdQJBd1ldD4tNwxeEFpzlUgTwLKgwZRMcYReKKt_ItqXjaCxDtaL3ghvKE8gGb42jjCxEcVORWo0ink4IDlZwoOThogUrMPP_5bN6C3Fyqy-MRa4OAM7uh77hSu9ofrw-e6o3enAZtfOQs2FiY73EwkmGTA1jj7DCqdNKPn6Q7fV2pvbn2BN4_ToW9qdanm79T5E9QcjRq3Er3SQ6k9SowJLAOM6hZA1RQs9h8Kmi2GhyS1aHtBtZQIf5xmW5zBeA",
    "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzNTg2MjUyMy1mYTEzLTRiODQtOGRhYS0yN2QyNWY0NmVmYTAifQ.eyJpYXQiOjE3NDcwNTgyOTQsImp0aSI6IjkzZTA2OTNlLTk0NTYtNDhjYi05YWQ4LTBlNWZjNmZlMTUxNCIsImlzcyI6Imh0dHBzOi8vYXV0aC51bGVwLnRoZXN0YWdpbmcuaW8vcmVhbG1zL2V0YW5kZW0iLCJhdWQiOiJodHRwczovL2F1dGgudWxlcC50aGVzdGFnaW5nLmlvL3JlYWxtcy9ldGFuZGVtIiwic3ViIjoiMjg2NTIxMTgtNGYzOC00MjdiLTlhNWYtOWIxMjBmNmU1Yzc1IiwidHlwIjoiT2ZmbGluZSIsImF6cCI6ImFwaSIsInNpZCI6IjczMzgxY2M0LTU5NGQtNGQwNi1hM2U3LWZkMTA3YTZjMjYyNiIsInNjb3BlIjoib3BlbmlkIGJhc2ljIGVtYWlsIGFjciByb2xlcyB3ZWItb3JpZ2lucyBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIn0.o_KxdSQzgbR1gp5rQIkY0R90Rh8gDRiyFMo7bzbTrzdvI32tTyPgx47P8AZpXk0mU5ITqqA_S7QfbmAJruh3xw"
}
```

Pour tout les appels les prochains appels, il faudra rajouter ce header afin de rester authentifié :

```http
Authorization: Bearer <access_token>
```

## Appel de l'API

Deux APIs sont disponible :

```shellscript
http://<apihost>/log-entries?page=1&limit=1&getNoSharedProfiles=0
```

permettant de récupérer toutes les activités par profil de façon paginée. 

le paramètre getNoSharedProfiles permet de récupérer ou non les activités des profils ayant partagés leur journaux. Ce paramètre n'a pas d'effet avec un compte "utilisateur".

```shellscript
http://<apihost>/log-entries/contact/<contact_id>?getNoSharedProfiles=0
```

Permet de récupérer les activités d'un compte en particulier. `contact_id` étant l'id Keycloak.

## Exemple de retour

```json
[
  {
    "user": {
      "id": "21e58052-19be-492d-8086-37ed1a77fd48",
      "email": "etudiant.numero-quatre@univ-lorraine.fr",
      "firstname": "Étudiant 4",
      "lastname": "Numéro 4",
      "gender": "MALE",
      "age": 23
    },
    "id": "2bb3e3cf-b60e-45cc-b469-42e01a9922bb",
    "logs": [
      {
        "id": "9ab905c9-63bb-4f0b-b27a-fe5ba4708586",
        "type": "TANDEM_CHAT",
        "createdAt": "2025-02-25T10:16:31.336Z",
        "metadata": {
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "0b358d1b-d996-4b52-80a3-f0e47a8f5d18",
        "type": "VISIO",
        "createdAt": "2025-02-25T10:20:28.809Z",
        "metadata": {
          "duration": 3,
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "3430c52f-9f2b-4a9f-bff3-4cb665d95bc4",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-02-25T10:06:00.000Z",
        "metadata": {
          "content": "Je viens de faire ma première demande en etandem pour apprendre l'anglais. Je suis en attente d'un partenaire d'une université anglaise. ",
          "title": "Ma demande de tandem"
        }
      },
      {
        "id": "7cd4cd33-eb52-44a8-b38f-b4b52219e78b",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-02-25T10:09:39.453Z",
        "metadata": {
          "entryNumber": 1,
          "vocabularyListId": "373f0303-d055-46ff-8427-f2219e48283c",
          "vocabularyListName": "Spicy"
        }
      },
      {
        "id": "62d942c9-e93d-4760-b6f8-f02642ee9718",
        "type": "SHARING_LOGS",
        "createdAt": "2025-02-25T10:24:35.286Z",
        "metadata": {}
      },
      {
        "id": "a6918da7-d381-455c-a6ab-36ab4918f798",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-02-28T09:19:12.056Z",
        "metadata": {
          "entryNumber": 2,
          "vocabularyListId": "5b2e5a5f-2a72-4736-a14f-3429b6893dac",
          "vocabularyListName": "Weather report"
        }
      },
      {
        "id": "24aa94fa-d93b-4cf9-b486-bcf9291dc44c",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-02-28T09:29:14.959Z",
        "metadata": {
          "entryNumber": 1,
          "vocabularyListId": "96acca0d-00ce-4124-988c-5cd1fc7ed665",
          "vocabularyListName": "Colors"
        }
      },
      {
        "id": "312ce3da-1a11-47e4-9263-364cfa3972e4",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-02-28T09:30:23.519Z",
        "metadata": {
          "entryNumber": 1,
          "vocabularyListId": "5ff7d15b-ac25-40c6-839f-3cb76677da9b",
          "vocabularyListName": "test"
        }
      },
      {
        "id": "50d4b685-59aa-4c65-bd6d-045714ac491a",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-03-04T08:46:26.276Z",
        "metadata": {
          "entryNumber": 1,
          "vocabularyListId": "373f0303-d055-46ff-8427-f2219e48283c",
          "vocabularyListName": "Spicy"
        }
      },
      {
        "id": "b4a605cd-408c-4602-bc8b-1c04ab45687c",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-03-04T08:43:00.000Z",
        "metadata": {
          "content": "Je continue à vérifier les divers bugFix depuis la version 867. Il me reste une dizaine d'anomalies à vérifier. ",
          "title": "Test de l'application ULEP 1.0 (875)"
        }
      },
      {
        "id": "adbceb00-269e-4f96-b973-78cbdcc3d1d1",
        "type": "TANDEM_CHAT",
        "createdAt": "2025-03-05T08:27:21.218Z",
        "metadata": {
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "d4e0a470-7eaa-46f9-853f-515e16fe77b5",
        "type": "VISIO",
        "createdAt": "2025-03-04T08:50:16.021Z",
        "metadata": {
          "duration": 3,
          "tandemFirstname": "Étudiant",
          "tandemLastname": "Numéro-Quatre"
        }
      },
      {
        "id": "465056bb-4219-433c-83d1-97551a34c3f7",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-03-04T08:47:00.000Z",
        "metadata": {
          "content": "J'ai trouvé un super thème de discussion au sujet de la négociation de prix. Il y a un article en référence, mais un peu compliqué. ",
          "title": "J'ai commencé une nouvelle fiche d'activité"
        }
      },
      {
        "id": "47ff422a-3e9c-440b-adf6-42cdc258454a",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-03-04T08:52:00.000Z",
        "metadata": {
          "content": "Avec Student Number Four. C'était trop court.",
          "title": "J'ai fait une session de quelques minutes"
        }
      },
      {
        "id": "9dde4c08-24eb-4461-b667-eb2a15db6072",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-03-04T08:56:00.000Z",
        "metadata": {
          "content": "Je n'ai pas encore d'idée. ",
          "title": "Je réfléchis à ma prochaine action. "
        }
      },
      {
        "id": "cf9395a1-2202-4bdd-94b1-e2e110f79639",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-03-04T09:05:00.000Z",
        "metadata": {
          "content": "C'est la fiche sur l'infiniment petit. ",
          "title": "J'ai une autre fiche d'activité à terminer. "
        }
      },
      {
        "id": "f6038eda-cade-4840-b4f2-5574b6330d94",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-03-04T09:14:43.251Z",
        "metadata": {
          "entryNumber": 2,
          "vocabularyListId": "96acca0d-00ce-4124-988c-5cd1fc7ed665",
          "vocabularyListName": "Colors !"
        }
      },
      {
        "id": "37891cde-4860-47ec-a078-0259b3438df4",
        "type": "TANDEM_CHAT",
        "createdAt": "2025-03-04T11:06:51.474Z",
        "metadata": {
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "60c3e716-6752-42f0-98cf-2ba276b00641",
        "type": "TANDEM_CHAT",
        "createdAt": "2025-03-06T09:29:03.517Z",
        "metadata": {
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "690379ef-b7b7-4b8d-82cb-0a7a5fb478a8",
        "type": "VISIO",
        "createdAt": "2025-03-05T08:30:08.860Z",
        "metadata": {
          "duration": 6,
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "def71a65-972b-45cd-b3a8-dd4838b49140",
        "type": "VISIO",
        "createdAt": "2025-03-06T09:32:40.134Z",
        "metadata": {
          "duration": 3,
          "tandemFirstname": "Student",
          "tandemLastname": "Number Four"
        }
      },
      {
        "id": "03168b7b-23aa-477c-a4f8-82fcb403ce49",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-02-25T13:59:16.367Z",
        "metadata": {
          "entryNumber": 1,
          "vocabularyListId": "5f523cba-c26c-4192-9b32-b763645ee6ca",
          "vocabularyListName": "Zu Hause"
        }
      },
      {
        "id": "e7ba4b7c-f1c4-4641-8f55-d65543ebd072",
        "type": "VISIO",
        "createdAt": "2025-02-26T08:37:09.033Z",
        "metadata": {
          "duration": 5,
          "tandemFirstname": "Étudiant",
          "tandemLastname": "Numéro-Quatre"
        }
      },
      {
        "id": "19f2004f-5df7-4c78-8989-e482875326c5",
        "type": "SHARING_LOGS",
        "createdAt": "2025-02-26T08:53:17.288Z",
        "metadata": {}
      },
      {
        "id": "9ee56bf6-10f7-42ef-b89a-f3fa6276bb6b",
        "type": "ADD_VOCABULARY",
        "createdAt": "2025-02-26T10:11:53.430Z",
        "metadata": {
          "entryNumber": 1,
          "vocabularyListId": "5f523cba-c26c-4192-9b32-b763645ee6ca",
          "vocabularyListName": "Zu Hause"
        }
      },
      {
        "id": "5fb3bd1e-8c5b-4262-9e80-ab0e7cac8ab3",
        "type": "TANDEM_CHAT",
        "createdAt": "2025-02-26T12:42:25.210Z",
        "metadata": {
          "tandemFirstname": "Timo",
          "tandemLastname": "Knapp"
        }
      },
      {
        "id": "756c4674-1732-41cb-8666-39ed8cfa354a",
        "type": "TANDEM_CHAT",
        "createdAt": "2025-02-27T13:28:05.447Z",
        "metadata": {
          "tandemFirstname": "Timo",
          "tandemLastname": "Knapp"
        }
      },
      {
        "id": "0f4b831e-66c0-4734-be0b-1a1692d82f83",
        "type": "CUSTOM_ENTRY",
        "createdAt": "2025-03-04T09:10:00.000Z",
        "metadata": {
          "title": "Je n'est pas révisé mon allemand. "
        }
      }
    ],
    "learnings": [
      {
        "id": "f32379d5-75e0-4394-a34e-be952a16d75f",
        "name": "English",
        "code": "en",
        "level": "B2",
        "profile": {},
        "createdAt": "2025-02-25T10:06:07.359Z",
        "campus": null,
        "certificateOption": false,
        "learningJournal": false,
        "consultingInterview": false,
        "sharedCertificate": false,
        "certificateFile": null,
        "specificProgram": false,
        "sameGender": false,
        "sameAge": false,
        "hasPriority": false,
        "sameTandemEmail": null,
        "learningType": "ETANDEM",
        "customLearningGoals": []
      },
      {
        "id": "4f5ca15f-c1db-4586-a477-1602c7719aed",
        "name": "Deutsch",
        "code": "de",
        "level": "A1",
        "profile": {},
        "createdAt": "2025-02-25T13:54:28.976Z",
        "campus": null,
        "certificateOption": true,
        "learningJournal": false,
        "consultingInterview": false,
        "sharedCertificate": false,
        "certificateFile": {},
        "specificProgram": false,
        "sameGender": false,
        "sameAge": false,
        "hasPriority": false,
        "sameTandemEmail": null,
        "learningType": "ETANDEM",
        "customLearningGoals": [
          {}
        ],
        "sharedLogsDate": "2025-02-26T08:53:17.160Z"
      },
      {
        "id": "ca73b4da-ef1c-45af-92f9-2cf188411851",
        "name": "Español",
        "code": "es",
        "level": "A0",
        "profile": {},
        "createdAt": "2025-03-04T08:21:04.824Z",
        "campus": {},
        "certificateOption": false,
        "learningJournal": false,
        "consultingInterview": false,
        "sharedCertificate": false,
        "certificateFile": null,
        "specificProgram": false,
        "sameGender": false,
        "sameAge": false,
        "hasPriority": false,
        "sameTandemEmail": null,
        "learningType": "BOTH",
        "customLearningGoals": []
      }
    ]
  }
]
```

## Script test

```bash
#!bin/bash
a=$(curl 'http://apihost.com/authentication/token'   -H 'Accept: application/json, application/pdf, text/csv'   -H 'Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'   -H 'Cache-Control: no-cache'   -H 'Connection: keep-alive'   -H 'Content-Type: application/json'   -H 'Origin: http://servogne.com:5173'   -H 'Pragma: no-cache'   -H 'Referer: http://servogne.com:5173/'   -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'   --data-raw '{"email":"only@api.com","password":"aaaaaa****123"}'   --insecure | jq .accessToken)
#remove all " from the token
a=$(echo $a | tr -d '"')
header="Authorization: Bearer $a"

curl -X 'GET' 'http://apihost.com/log-entries?page=1&limit=1&getNoSharedProfiles=0' -H 'accept: application/json' -H "$header" | jq
```