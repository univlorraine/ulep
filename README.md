# eTandems ULEP

Le projet **ULEP** porté par l’université de Lorraine a pour objectif de proposer une application web et mobile open source d’apprentissage linguistique sous la forme de tandems où chacun peut apprendre la langue de son partenaire.

ULEP a été financé en partie par le plan **France Relance 2030** dans le cadre de l'appel à projets DemoES 2021 **Démonstrateurs numériques dans l'enseignement supérieur** 

ULEP est l'acronyme de : University Language Exchange Programme. Le principe a pour objectif de pratiquer une langue étrangère avec un natif. 

- Les utilisateurs d'ULEP doivent faire partie d'universités qui sont préalablement configurées dans l'application.
- Une de ces universités est l'université centrale, c'est elle qui dirige le programme.
- Les personnes désirant s'inscrire au programme enregistrent leur profil, leurs compétences en langues et leurs souhaits pour les modalités d'échange en tandem.
- L'algorithme d'ULEP propose des associations d'inscrits par paires, selon les données de chacun et concernant toujours au moins un inscrit de l'université centrale.
- Quand deux personnes de langue maternelle différente sont appariés, elles s’engagent à se rencontrer régulièrement via l'application ou dans la vie réelle pour échanger dans leur langue et s’épauler dans leur apprentissage.
- Les deux partenaires linguistiques sont entièrement autonomes : ils choisissent le rythme, le lieu, le contenu et le mode de leurs rencontres.
- L’objectif est à la fois linguistique et culturel, permettant de s’initier à la culture de l’autre tout en pratiquant des langues étrangères.

## Fonctionnalités

L'application est constituée d'une partie back-office en mode web pour tout ce qui concerne le paramétrage des universités partenaires, pour la réalisation des tandems, pour le suivi des signalements. La deuxième partie de l'application se présente sous la forme d'une application mobile pour système Android ou iOS, complétée par une version web pour tout navigateur internet. 

Les utilisateurs pourront : 

- S'inscrire en renseignant des données personnelles de profil utilisateur.
- Faire une demande de tandem en langue, en choisissant des options pour la pédagogie d'apprentissage. 
- Dialoguer par chat, avec son partenaire de tandem, ou via un salon de discussion bilingue.
- Dialoguer en appel visioconférence (système interne à l'application) avec son partenaire de tandem.
- Renseigner un journal d'apprentissage, par langue.
- Créer des listes de vocabulaire et s'entraîner à mémoriser les listes avec un jeu sous forme de flashcards.
- Consulter et ou créer des fiches d'apprentissage.
- Lire des actualités en plusieurs langues, proposées par les universités.
- S'inscrire à des événements proposés par les universités.

## Documentation

[Consulter notre wiki](https://github.com/univlorraine/ulep/wiki)

## Licence

**ULEP** est sous la licence [CeCILL-2.1](LICENCE). L’application a été développée avec des technologies et des composants open source.

L’université de Lorraine met à disposition le code source de l’application, dans le cadre de la licence précitée. L’université de Lorraine ne propose pas d’accompagnement à l’installation et au paramétrage du code source.

<p align="center">
  <img src="https://github.com/user-attachments/assets/08f9f01e-07bf-49fe-97c8-37103999a2a4" alt="logo-FranceRelance2030" />
  <img width="462" height="140" alt="logo-ANR" src="https://github.com/user-attachments/assets/1038afb4-7ea7-4810-a116-e1c5384ca5d3" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f53e9c7c-10f4-4ea4-a6b6-55ec35775f8f" alt="logo-Academie-Nancy-Metz" />
  <img src="https://github.com/user-attachments/assets/784c6b51-ee38-4554-b2d6-9caea49abada" alt="logo-PleiadesDemoES" />
</p>

<p align="center">
  <img width="300" height="130" alt="logo-UnivLorraine" src="https://github.com/user-attachments/assets/b08f96a9-25c0-4a25-9ca4-b8d6aba5a727" />
</p>

## Avant de démarrer

La construction de l’ensemble de l’architecture technique d’ULEP requiert des solides connaissances en informatique devOps. En plus des compétences en gestion de contenus conteneurisés, le projet requiert de savoir orchestrer les conteneurs avec la technologie Kubernetes. Pour préparer les versions d’applications mobiles compatibles smartphone, la compilation des exécutables nécessite les environnements de développement adhoc pour Android et iOS.

L’équipe technique recommandée est structurée à minima par : 

- 1 ingénieur.e DevOps
- 1 ingénieur.e DevMobile
- 1 ingénieur.e Infrastructures et réseaux

Pour la gestion du projet il est nécessaire de constituer une équipe composée d’informaticiens, d’un administrateur fonctionnel de l’application (paramétrage, animation de la communauté des utilisateurs…) et de référents pédagogiques.

Les sources de l’application sont fournies sans accompagnement technique ni garantie de la part de l’Université de Lorraine.

Pour toute question sur la mise en place d’ULEP dans votre établissement vous pouvez contacter l’équipe de l’Université de Lorraine par mail ulep-contact@univ-lorraine.fr qui pourra vous orienter vers un prestataire en mesure de vous accompagner.

## Installation

You can use this project with Docker. Simply go to the project directory and run the following commands on your CLI:

```bash
docker compose build --pull --no-cache
```

Note: replace !Changeme! by your own values in [docker-compose.yml](./docker-compose.yaml)

If you launch the project locally (i.e. with dev [docker-compose.override.yml](./docker-compose.override.yml) file),
install node_modules for [api](./api/) and [admin](./admin/) projects before launching containers:

```bash
cd api
pnpm install
cd ../admin
pnpm install
```

Then, start project:

```bash
docker compose up --detach
```

This will build and run the project on your localhost. You now have access to the following services:

- [Admin](http://localhost:3001)
- [Api](http://localhost:3002)
- [Keycloak](http://localhost:8080)
- [Minio](http://localhost:9000)

## Database initilization.

To initialize database schema, run the migrations:

```bash
make migration
```

To seed database:

```bash
make seed
```

To seed database with random flag:

```bash
make seed-random
```

## Keycloak

1. Setting up Keycloak

Open Keycloak by navigating to http://localhost:8080 in your browser. You'll be redirected to the administration console
where you'll log in with the admin user.

Now create a realm. A realm in Keycloak is the equivalent of a tenant. It allows creating isolated spaces where
applications, users, roles, and groups exist. From the Master drop-down list, click on Add realm.
Give your realm a name and click Create.

Next, create a client. Clients in Keycloak are entities that can request Keycloak to authenticate a user. Go to
Clients -> Create, fill in the necessary details, and save.

Note: a realm is available [here](./docker/keycloak/realms/etandem.json) and integrate base API / admin clients. It
should be loaded automatically at start of container.

2. User and KeycloakGroup Creation

You'll need at least one user to test the authentication. Go to Users -> Add user, provide the details and credentials,
and click Save.

You might also need roles, which can be added from Roles -> Add KeycloakGroup. Once created, you can assign roles to a
user from the user's detail page.

Note: an "admin" role already exist for backoffice user. It is needed in order to perform actions in backoffice.
See [repository wiki](https://github.com/thetribeio/etandem/wiki/Cr%C3%A9ation-d'un-utilisateur-du-Backoffice) on more
information on how to create and assign role to user.

## Development

### Migrations

You can generate a new migration from database schema with:

```bash
make migration
```

## Information additionnelle

Pour toute demande d’informations complémentaires, vous pouvez nous contacter par email à l’adresse : ulep-contact@univ-lorraine.fr
