# Déploiement des services applicatifs

Les services applicatifs sont l'ensemble des services avec lesquels l'application Ulep vas communiquer.
Ils sont composés des briques suivantes:

- **L'api**: Permet un accès sécurisé à la base de données ainsi qu'aux algorithmes.
- **Minio**: Service de stockage d'objets (ex: images)
- **Keycloak**: Service d'authentification
- **Back office**: Permettant un accès administrateur aux données de la base.
- **Application web**: Version web de l'application Ulep
- **Base de donnée Postgres**: Non exposée, elle stocke les données utilisateurs.
- **Base de donnée MongoDB**: Non exposée, elle stocke les données du chat.
- **Base de donnée Redis**: Non exposée, elle stocke les données du chat en temps réel.
- **Application web**: Permet un accès web à l'application.
- **Le chat**: Service de chat
- **Glitchtip**: Service de tracking d'erreur et de monitoring
- **Jitsi**: Service de vidéoconference
- **Weblate**: Service de traduction

Toute cette partie se trouve dans le dossier `helm/project`

## <u>Préparer le déploiement</u>

Tout d'abord il faut copier le fichier `values.yaml.tmp` vers `values.yaml`

### <u>Comprendre et remplir le fichier `values.yaml`</u>

Le fichier `values.yaml` sert à définir les variables pour l'instance que l'on souhaite monter.

Il est séparé en plusieurs parties:

<u>**Les variables globales:**</u>

| Name                              | Description                                                                                             | Value           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------- |
| `name`                            | Nom du projet, utiliser dans les noms des objets kubernetes                                             | "ulep"          |
| `domain`                          | Nom de domaine utilisé pour rendre accessible les services. Les services utiliserons des sous domaines. | ""              |
| `issuerName`                      | Nom du cluster issuer mis en place dans[cette étape](clusterIssuer)                                     | "letsencrypt"   |
| `ingressName`                     | ingress utilisé par le cluster                                                                          | "\*ingressName" |
|                                   |                                                                                                         |                 |
| `apiUrl`                          | Sous domaine utilisé pour l'api                                                                         | "api"           |
| `firebaseProjectId`               | ID du projet Firebase                                                                                   |                 |
| `firebasePrivateKey`              | Clé privée pour connecter l'api au service firebase                                                     |                 |
| `firebaseClientEmail`             | Email pour connecter l'api au service firebase                                                          |                 |
|                                   |                                                                                                         |                 |
| `authUrl`                         | Sous domaine utilisé pour keycloak                                                                      | "auth"          |
|                                   |                                                                                                         |                 |
| `jitsiUrl`                        | Sous domaine utilisé pour Jitsi                                                                         | "jitsi"         |
|                                   |                                                                                                         |                 |
| `adminUrl`                        | Sous domaine utilisé pour le back-office                                                                | "admin"         |
|                                   |                                                                                                         |                 |
| `chatUrl`                         | Sous domaine utilisé pour le chat                                                                       | "chat"          |
| `socketChatUrl`                   | Sous domaine utilisé pour le websocket chat                                                             | "chat-ws"       |
|                                   |                                                                                                         |                 |
| `minioUrl`                        | Sous domaine utilisé pour le l'interface utilisateur du service de stockage d'objet                     | "minio"         |
| `minioApiUrl`                     | Sous domaine utilisé pour contacter l'api de minio                                                      | "minio-api"     |
| `minioAccessKey`                  | Access key pour l'api de minio                                                                          | "minio"         |
| `minioSecretKey`                  | Secret key pour l'api de minio                                                                          | ""              |
|                                   |                                                                                                         |                 |
| `keycloakUrl`                     | Sous domaine utilisé pour le service d'authentification                                                 | "auth"          |
| `keycloakAdminPassword`           | Mot de passe de l'admin de keycloak                                                                     | ""              |
| `keycloakClientSecret`            | Secret du client pour l'api keycloak                                                                    | ""              |
|                                   |                                                                                                         |                 |
| `webappUrl`                       | Sous domaine utilisé pour la version web de l'application                                               | "webapp"        |
|                                   |                                                                                                         |                 |
| `weblateApiUrl`                   | Sous domaine utilisé pour weblate                                                                       | "weblate"       |
|                                   |                                                                                                         |                 |
| `glitchtipUrl`                    | Sous domaine utilisé pour Glitchtip                                                                     | "glitchtip"     |
|                                   |                                                                                                         |                 |
| `global.postgresql.auth.username` | Nom d'utilisateur de la base PostgreSQL                                                                 |                 |
| `global.postgresql.auth.password` | Password d'utilisateur de la base PostgreSQL                                                            |                 |
| `global.postgresql.auth.database` | Nom de la base de données de la base PostgreSQL                                                         |                 |
| `global.redis.password`           | Password du redis                                                                                       |                 |

<u>**Les variables API:**</u>

| Name                                                     | Description                                                                                                                                                                                         | Value                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `api.name`                                               | Nom du pod et du sous domaine utilisé pour l'exposé.                                                                                                                                                | "api"                                                                            |
| `api.replicaCount`                                       | Nombre de réplica du service                                                                                                                                                                        | 1                                                                                |
| `api.image.repository`                                   | Nom du repository et de l'image docker                                                                                                                                                              | "rg.fr-par.scw.cloud/ulep/api-prod"                                              |
| `api.image.tag`                                          | Nom du tag de l'image docker                                                                                                                                                                        | "latest"                                                                         |
| `api.image.pullPolicy`                                   | Pull policy de l'image docker                                                                                                                                                                       | "IfNotPresent"                                                                   |
| `api.initImage.repository`                               | Nom du repository et de l'image docker d'initialisation d'api                                                                                                                                       | "rg.fr-par.scw.cloud/ulep/api-init"                                              |
| `api.initImage.tag`                                      | Nom du tag de l'image docker                                                                                                                                                                        | "latest"                                                                         |
| `api.initImage.pullPolicy`                               | Pull policy de l'image docker                                                                                                                                                                       | "IfNotPresent"                                                                   |
| `api.env.adminUrl`                                       | Url du pod admin                                                                                                                                                                                    | \*adminUrl                                                                       |
| `api.env.chatUrl`                                        | Url du pod de chat                                                                                                                                                                                  | \*chatUrl                                                                        |
| `api.env.appUrl`                                         | Url du pod d'app                                                                                                                                                                                    | \*appUrl                                                                         |
| `api.env.logLevel`                                       | Niveau de logging                                                                                                                                                                                   | debug                                                                            |
| `api.env.defaultTranslationLanguage`                     | Traduction par défaut                                                                                                                                                                               | en                                                                               |
| `api.env.keycloakRealm`                                  | Nom du realm de l'application                                                                                                                                                                       | "latest"                                                                         |
| `api.env.keycloakAdmin`                                  | Nom de l'administrateur keycloak                                                                                                                                                                    | "admin"                                                                          |
| `api.env.keycloakClientId`                               | Nom du sous domaine de l'api                                                                                                                                                                        | "api"                                                                            |
| `api.env.keycloakClientSecret`                           | Secret partager avec`auth.realmFile` dans le secret clients api                                                                                                                                     | ""                                                                               |
| `api.env.keycloakAdminRoleName`                          | Nom du role de l'admin                                                                                                                                                                              | admin                                                                            |
| `api.env.minioUrl`                                       | Url public du minio                                                                                                                                                                                 | "https://minio-api.ulep.thestaging.io"                                           |
| `api.env.minioAccessKey`                                 | Nom d'utilisateur minio                                                                                                                                                                             | "minio"                                                                          |
| `api.env.minioSecretKey`                                 | Mot de passe de l'utilisateur minio                                                                                                                                                                 | ""                                                                               |
| `api.env.i18nMinioUrl`                                   | Endpoint utilisée pour découvrir et récupérer les traductions. Ne doit pas avoir de`/` à la fin                                                                                                     | ""                                                                               |
| `api.env.i18nReloadInterval`                             | L'interval de temps (en ms) entre les rafraichissement des traductions (et découvertes des nouvelles traductions).**Attention à mettre entre guillemets la valeur pour éviter un pb de conversion** | "86400000" (1 jour)                                                              |
| `api.env.i18nDebug`                                      | Active le mode debug du service i18n                                                                                                                                                                | ""                                                                               |
| `api.env.emailsAssetsBucket`                             | Nom du bucket contenant les assets des emails                                                                                                                                                       | `assets`                                                                         |
| `api.env.notificationAssetsBucket`                       | Nom du bucket contenant les assets des notifications                                                                                                                                                | `assets`                                                                         |
| `api.env.emailsAssetsPublicEndpoint`                     | Url pour récupérer les assets des emails                                                                                                                                                            | `api`. Note: cette valeur sera concaténé avec le nom de domaine défini au global |
| `api.env.notificationAssetsPublicEndpoint`               | Url pour récupérer les assets des notifications                                                                                                                                                     | `api`. Note: cette valeur sera concaténé avec le nom de domaine défini au global |
| `api.env.appLinkAppleStore`                              | Lien vers l'Spple Store                                                                                                                                                                             |                                                                                  |
| `api.env.appLinkPlayStore`                               | Lien vers le Play Store                                                                                                                                                                             |                                                                                  |
| `api.env.smtpHost`                                       | Host du serveur SMTP                                                                                                                                                                                | "localhost"                                                                      |
| `api.env.smtpPort`                                       | Port du serveur SMTP                                                                                                                                                                                | "25"                                                                             |
| `api.env.smtpSecure`                                     | Utilisation du TLS pour la connexion au serveur SMTP                                                                                                                                                | false                                                                            |
| `api.env.smtpIgnoreTLS`                                  | Ignorer le TLS pour la connexion au serveur SMTP                                                                                                                                                    | true                                                                             |
| `api.env.smtpSender`                                     | Adresse email utilisée pour l'envoi d'email                                                                                                                                                         | tandems@ulep.fr                                                                  |
| `api.env.smtpDisableBootVerification`                    | Désactivation de la vérification de la communication avec le serveur SMTP au démarrage de l'API                                                                                                     | false                                                                            |
| `api.env.firebasePrivateKey`                             | Clé privée du compte service du projet firebase. Voir la page[Firebase push notifications](Initialisation-Firebase-Push-Notification)                                                               | ""                                                                               |
| `api.env.firebaseClientEmail`                            | Email du compte service du projet firebase. Voir la page[Firebase push notifications](Initialisation-Firebase-Push-Notification)                                                                    | ""                                                                               |
| `api.env.firebaseProjetId`                               | Id du projet firebase. Voir la page[Firebase push notifications](Initialisation-Firebase-Push-Notification)                                                                                         | ""                                                                               |
| `api.env.firebaseParallelLimit`                          | Nombre de notifications envoyées en même temps                                                                                                                                                      | 3                                                                                |
| `api.env.defaultTranslationLanguage`                     | Langage par défaut pour les traductions API (emails uniquement)                                                                                                                                     |                                                                                  |
| `api.env.sentryDsn`                                      | Nom datasource Sentry (DSN)                                                                                                                                                                         |                                                                                  |
| `api.env.cancelTresholdInMin`                            | Threshold d'annulation                                                                                                                                                                              |                                                                                  |
| `api.env.signedUrlExpirationInSeconds`                   | Temps de validité d'une url signée                                                                                                                                                                  |                                                                                  |
| `api.env.weblateApiUrl`                                  | url de weblate                                                                                                                                                                                      |                                                                                  |
| `api.autoscaling.enabled`                                | Active le l'autoscaling du service api                                                                                                                                                              | false                                                                            |
| `api.autoscaling.minReplicas`                            | Nombre minimum de réplica                                                                                                                                                                           | 1                                                                                |
| `api.autoscaling.maxReplicas`                            | Nombre maximum de réplica                                                                                                                                                                           | 100                                                                              |
| `api.autoscaling.targetCPUUtilizationPercentage`         | Cible d'utilisation du CPU                                                                                                                                                                          | 80                                                                               |
| `api.service.type`                                       | Type de service api                                                                                                                                                                                 | "CLusterIP"                                                                      |
| `api.service.port`                                       | Numéro de port du service                                                                                                                                                                           | 80                                                                               |
| `api.probes.readiness.initialDelaySeconds`               | Durée avant d'effectuer la 1ère probe de`readiness`                                                                                                                                                 | 0                                                                                |
| `api.probes.readiness.periodSeconds`                     | Période entre les probes de`readiness`                                                                                                                                                              | 10                                                                               |
| `api.probes.readiness.failureThreshold`                  | Nombre de tentative de la probe`readiness` avant d'abandonner                                                                                                                                       | 6                                                                                |
| `api.probes.liveness.initialDelaySeconds`                | Durée avant d'effectuer la 1ère probe de`liveness`                                                                                                                                                  | 0                                                                                |
| `api.probes.liveness.periodSeconds`                      | Période entre les probes de`liveness`                                                                                                                                                               | 10                                                                               |
| `api.probes.liveness.failureThreshold`                   | Nombre de tentative de la probe`liveness` avant d'abandonner                                                                                                                                        | 6                                                                                |
| `api.ingress.enabled`                                    | Active l'exposition du service                                                                                                                                                                      | true                                                                             |
| `api.ingress.className`                                  | Nom du service ingress controller                                                                                                                                                                   | "treafik"                                                                        |
| `api.ingress.annotations.kubernetes.io/ingress.class`    | Nom du service ingress controller                                                                                                                                                                   | "\*ingressName"                                                                  |
| `api.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer                                                                                                                                                                               | "letsencrypt"                                                                    |
| `api.ingress.annotations.kubernetes.io/tls-acme`         | Activate tls                                                                                                                                                                                        | true                                                                             |
| `api.ingress.hosts`                                      | Nom de l'hôte                                                                                                                                                                                       | [host: *apiUrl]                                                                  |
| `api.ingress.tls`                                        | Liste des hôtes                                                                                                                                                                                     | \["\*apiUrl"\]                                                                   |

<u>**Les variables Keycloak (auth):**</u>

| Name                                                      | Description                                                    | Value                                |
| --------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| `auth.name`                                               | Nom du pod et du sous domaine utilisé pour l'exposé.           | "auth"                               |
| `auth.replicaCount`                                       | Nombre de réplica du service                                   | 1                                    |
| `auth.image.repository`                                   | Nom du repository et de l'image docker                         | "quay.io/keycloak/keycloak"          |
| `auth.image.tag`                                          | Nom du tag de l'image docker                                   | "21.1"                               |
| `auth.image.pullPolicy`                                   | Pull policy de l'image docker                                  | "IfNotPresent"                       |
| `auth.initImage.repository`                               | Nom du repository et de l'image docker d'initialisation        | "rg.fr-par.scw.cloud/ulep/auth-prod" |
| `auth.initImage.tag`                                      | Nom du tag de l'image docker d'initialisation                  | "latest"                             |
| `auth.env.keycloakAdmin`                                  | Nom de l'administrateur keycloak                               | "admin"                              |
| `auth.env.keycloakAdminPassword`                          | Mot de passe de l'administrateur keycloak                      | ""                                   |
| `auth.env.kcDB`                                           | Nom de la base de donnée                                       | "postgres"                           |
| `auth.env.kcDBSchema`                                     | Nom du schema prisma                                           | "keycloak"                           |
| `auth.env.logLevel`                                       | Niveau de log                                                  | "INFO"                               |
| `auth.env.proxyAddressForwarding`                         | Active le forwarding d'address                                 | true                                 |
| `auth.autoscaling.enabled`                                | Active le l'autoscaling du service api                         | false                                |
| `auth.autoscaling.minReplicas`                            | Nombre minimum de réplica                                      | 1                                    |
| `auth.autoscaling.maxReplicas`                            | Nombre maximum de réplica                                      | 100                                  |
| `auth.autoscaling.targetCPUUtilizationPercentage`         | Cible d'utilisation du CPU                                     | 80                                   |
| `auth.service.type`                                       | Type de service                                                | "CLusterIP"                          |
| `auth.service.port`                                       | Numéro de port du service                                      | 80                                   |
| `auth.probes.startup.initialDelaySeconds`                 | Durée avant d'effectuer la 1ère probe de`startup`              | 10                                   |
| `auth.probes.startup.periodSeconds`                       | Période entre les probes de`startup`                           | 10                                   |
| `auth.probes.startup.failureThreshold`                    | Nombre de tentative de la probe`startup` avant d'abandonner    | 12                                   |
| `auth.probes.readiness.initialDelaySeconds`               | Durée avant d'effectuer la 1ère probe de`readiness`            | 0                                    |
| `auth.probes.readiness.periodSeconds`                     | Période entre les probes de`readiness`                         | 5                                    |
| `auth.probes.readiness.failureThreshold`                  | Nombre de tentative de la probe`readiness` avant d'abandonner  | 10                                   |
| `auth.probes.liveness.initialDelaySeconds`                | Durée avant d'effectuer la 1ère probe de`liveness`             | 0                                    |
| `auth.probes.liveness.periodSeconds`                      | Période entre les probes de`liveness`                          | 5                                    |
| `auth.probes.liveness.failureThreshold`                   | Nombre de tentative de la probe`liveness` avant d'abandonner   | 5                                    |
| `auth.ingress.enabled`                                    | Active l'exposition du service                                 | true                                 |
| `auth.ingress.className`                                  | Nom du service ingress controller                              | "treafik"                            |
| `auth.ingress.annotations.kubernetes.io/ingress.class`    | Nom du service ingress controller                              | "\*ingressName"                      |
| `auth.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer                                          | "letsencrypt"                        |
| `auth.ingress.annotations.kubernetes.io/tls-acme`         | Activate tls                                                   | true                                 |
| `auth.ingress.hosts`                                      | Nom de l'hôte                                                  | [host: *authUrl]                     |
| `auth.ingress.tls`                                        | Liste des hôtes                                                |                                      |

<u>**Les variables de la BDD PostgreSQL:**</u>

Le chart Helm Postgresql est le chart Bitnami, vous pourrez trouver plus d'information sur [la page dédiée](https://artifacthub.io/packages/helm/bitnami/postgresql)

Il est recommandé de garder les valeurs définies avec les ancres dans le fichier de valeurs par défaut.

| Name                                         | Description                                       | Value             |
| -------------------------------------------- | ------------------------------------------------- | ----------------- |
| `postgresql.primary.initdb.scriptsConfigMap` | Nom du config map permettant d'initialiser la BDD | \*dbInitScriptsCM |
| `postgresql.primary.persistence.size`        | Taille de la BDD                                  | `8Gi`             |

<u>**Les variables de la MongoDB:**</u>

Le chart Helm MongoDB est le chart Bitnami, vous pourrez trouver plus d'information sur [la page dédiée](https://artifacthub.io/packages/helm/bitnami/mongodb)

Il est recommandé de garder les valeurs définies avec les ancres dans le fichier de valeurs par défaut.

| Name                             | Description                                                        | Value              |
| -------------------------------- | ------------------------------------------------------------------ | ------------------ |
| `mongodb.auth.*`                 | Toutes les informations nécessaires à l'authentification sur la DB |                    |
| `mongodb.initdbScriptsConfigMap` | le nom du configMap permettant d'initialiser la DB                 | ulep-init-database |
| `mongodb.persistence.size`       | Taille de la BDD                                                   | `8Gi`              |

<u>**Les variables de la Redis:**</u>

Le chart Helm Redis est le chart Bitnami, vous pourrez trouver plus d'information sur [la page dédiée](https://artifacthub.io/packages/helm/bitnami/redis)

Il est recommandé de garder les valeurs définies avec les ancres dans le fichier de valeurs par défaut.

| Name                       | Description      | Value |
| -------------------------- | ---------------- | ----- |
| `mongodb.persistence.size` | Taille de la BDD | `8Gi` |

<u>**Les variables de minio:**</u>

Le chart Helm MinIO est le chart Bitnami, vous pourrez trouver plus d'information sur [la page dédiée](https://artifacthub.io/packages/helm/bitnami/minio)

Il est recommandé de configurer les champs suivants:

| Name                                                          | Description                                                                                           | Value                                          |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `minio.global.storageClass`                                   | [Classe de stockage Kubernetes](https://kubernetes.io/docs/concepts/storage/storage-classes) utilisée | "scw-bssd"                                     |
| `minio.image.tag`                                             | Tag de l'image Docker MinIO utilisée                                                                  | `2023.9.30-debian-11-r0`                       |
| `minio.clientImage.tag`                                       | Tag de l'image client Docker MinIO utilisée                                                           | `2023.9.29-debian-11-r0`                       |
| `minio.auth.rootUser`                                         | Nom de l'administrateur keycloak                                                                      | "minio"                                        |
| `minio.auth.rootPassword`                                     | Mot de passe de l'administrateur minio                                                                | ""                                             |
| `minio.persistence.size`                                      | Espace réservé par les volumes du service                                                             | `40Gi`                                         |
| `minio.mode`                                                  | Mode du serveur (distribué ou standalone)                                                             | `distributed`                                  |
| `minio.statefulset.replicaCount`                              | Nombre de noeuds MinIO en mode distribué                                                              | `2`                                            |
| `minio.statefulset.drivesPerNode`                             | Nombre de volumes par noeud en mode distributé                                                        | `2`                                            |
| `minio.ingress.enabled`                                       | Active l'exposition du service                                                                        | `true`                                         |
| `minio.ingress.ingressClassName`                              | Nom du service ingress controller                                                                     | `*ingressName`                                 |
| `minio.ingress.hostname`                                      | Hostname pour le sevice                                                                               | `YOUR_HOST_FOR_MINIO`                          |
| `minio.ingress.path`                                          | Chemin du service sur lequel pointe l'ingress                                                         | `/`                                            |
| `minio.ingress.pathType`                                      | Type de chemin du service sur lequel pointe l'ingress                                                 | `Prefix`                                       |
| `minio.ingress.servicePort`                                   | Port du service sur lequel pointe l'ingress                                                           | `9001`                                         |
| `minio.ingress.annotations.kubernetes.io/ingress.class`       | Nom du service ingress controller                                                                     | `*ingressName`                                 |
| `minio.ingress.annotations.cert-manager.io/cluster-issuer`    | Nom du service cluster controller                                                                     | `letsencrypt`                                  |
| `minio.ingress.annotations.kubernetes.io/tls-acme`            | Active le TLS ACME                                                                                    | `true`                                         |
| `minio.ingress.tls`                                           | Active le TLS                                                                                         | `true`                                         |
| `minio.ingress.extraTls[0].hosts`                             | Configuration TLS supplémentaire pour le 1er host: nom du host                                        | `["YOUR_HOST_FOR_MINIO"]`                      |
| `minio.ingress.extraTls[0].secretName`                        | Configuration TLS supplémentaire pour le 1er host: nom du secret pour stocker le certificat           | `minio`                                        |
| `minio.apiIngress.enabled`                                    | Active l'exposition du service API                                                                    | `true`                                         |
| `minio.apiIngress.ingressClassName`                           | Nom du service ingress controller pour l'ingress API                                                  | `*ingressName`                                 |
| `minio.apiIngress.hostname`                                   | Hostname pour l'API                                                                                   | `YOUR_HOST_FOR_MINIO_API`                      |
| `minio.ingress.path`                                          | Chemin du service sur lequel pointe l'ingress API                                                     | `/`                                            |
| `minio.ingress.pathType`                                      | Type de chemin du service sur lequel pointe l'ingress API                                             | `Prefix`                                       |
| `minio.ingress.servicePort`                                   | Port du service sur lequel pointe l'ingress API                                                       | `9000`                                         |
| `minio.apiIngress.annotations.kubernetes.io/ingress.class`    | Nom du service ingress controller                                                                     | `*ingressName`                                 |
| `minio.apiIngress.annotations.cert-manager.io/cluster-issuer` | Nom du service cluster controller                                                                     | `letsencrypt`                                  |
| `minio.apiIngress.annotations.kubernetes.io/tls-acme`         | Active le TLS ACME                                                                                    | `true`                                         |
| `minio.apiIngress.tls`                                        | Active le TLS                                                                                         | `true`                                         |
| `minio.apiIngress.extraTls[0].hosts`                          | Configuration TLS supplémentaire pour le 1er host: nom du host                                        | `["YOUR_HOST_FOR_MINIO_API"]`                  |
| `minio.apiIngress.extraTls[0].secretName`                     | Configuration TLS supplémentaire pour le 1er host: nom du secret pour stocker le certificat           | `minio-api`                                    |
| `minio.defaultBuckets`                                        | Bucket à créer par défaut                                                                             | `i18n,assets,objective:private,images:private` |

Note dans le cas où MinIO est déployé en mode distribué:

- Un minimum de 4 drive est nécessaire pour garantir le mode [erasure coding](https://min.io/docs/minio/linux/operations/concepts/erasure-coding.html)
- L'espace de stockage réellement disponible est inférieur à la somme de l'espace des volumes utilisés. Voir le [simulateur MinIO](https://min.io/product/erasure-code-calculator?ref=docs) pour comprendre le réel stockage disponible (80Gi avec la configuration par défaut)

<u>**Les variables du Back-office:**</u>

| Name                                                       | Description                                                             | Value                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `admin.name`                                               | Nom du pod et du sous domaine utilisé pour l'exposé.                    | "admin"                              |
| `admin.replicaCount`                                       | Nombre de réplica du service                                            | 1                                    |
| `admin.image.repository`                                   | Nom du repository et de l'image docker                                  | "rg.fr-par.scw.cloud/ulep/admin-dev" |
| `admin.image.tag`                                          | Nom du tag de l'image docker                                            | "latest"                             |
| `admin.image.pullPolicy`                                   | Pull policy de l'image docker                                           | "IfNotPresent"                       |
| `admin.env.keycloakClientSecret`                           | Secret partager avec`auth.realmFile` dans le secret clients react-admin | ""                                   |
| `admin.env.sentryDsn`                                      | Nom datasource Sentry (DSN)                                             |                                      |
| `admin.autoscaling.enabled`                                | Active le l'autoscaling du service admin                                | false                                |
| `admin.autoscaling.minReplicas`                            | Nombre minimum de réplica                                               | 1                                    |
| `admin.autoscaling.maxReplicas`                            | Nombre maximum de réplica                                               | 100                                  |
| `admin.autoscaling.targetCPUUtilizationPercentage`         | Cible d'utilisation du CPU                                              | 80                                   |
| `admin.service.type`                                       | Type de service                                                         | "CLusterIP"                          |
| `admin.service.port`                                       | Numéro de port du service                                               | 80                                   |
| `admin.probes.startup.initialDelaySeconds`                 | Durée avant d'effectuer la 1ère probe de`startup`                       | 60                                   |
| `admin.probes.startup.periodSeconds`                       | Période entre les probes de`startup`                                    | 30                                   |
| `admin.probes.startup.failureThreshold`                    | Nombre de tentative de la probe`startup` avant d'abandonner             | 5                                    |
| `admin.probes.readiness.initialDelaySeconds`               | Durée avant d'effectuer la 1ère probe de`readiness`                     | 0                                    |
| `admin.probes.readiness.periodSeconds`                     | Période entre les probes de`readiness`                                  | 10                                   |
| `admin.probes.readiness.failureThreshold`                  | Nombre de tentative de la probe`readiness` avant d'abandonner           | 3                                    |
| `admin.probes.liveness.initialDelaySeconds`                | Durée avant d'effectuer la 1ère probe de`liveness`                      | 0                                    |
| `admin.probes.liveness.periodSeconds`                      | Période entre les probes de`liveness`                                   | 5                                    |
| `admin.probes.liveness.failureThreshold`                   | Nombre de tentative de la probe`liveness` avant d'abandonner            | 3                                    |
| `admin.ingress.enabled`                                    | Active l'exposition du service                                          | true                                 |
| `admin.ingress.className`                                  | Nom du service ingress controller                                       | "\*ingressName"                      |
| `admin.ingress.annotations.kubernetes.io/ingress.class`    | Nom du service ingress controller                                       | "\*ingressName"                      |
| `admin.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer                                                   | "letsencrypt"                        |
| `admin.ingress.annotations.kubernetes.io/tls-acme`         | Activate tls                                                            | true                                 |
| `admin.ingress.hosts`                                      | Nom de l'hôte                                                           | [host: *adminUrl]                    |
| `admin.ingress.tls`                                        | Liste des hôtes                                                         | \[" \*adminUrl"\]                    |

<u>**Les variables Chat:**</u>

| Name                                                      | Description                                                    | Value                               |
| --------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| `chat.name`                                               | Nom du pod et du sous domaine utilisé pour l'exposé.           | "api"                               |
| `chat.replicaCount`                                       | Nombre de réplica du service                                   | 1                                   |
| `chat.image.repository`                                   | Nom du repository et de l'image docker                         | "rg.fr-par.scw.cloud/ulep/api-prod" |
| `chat.image.tag`                                          | Nom du tag de l'image docker                                   | "latest"                            |
| `chat.image.pullPolicy`                                   | Pull policy de l'image docker                                  | "IfNotPresent"                      |
| `chat.env.mongoInitUser`                                  | Nom utilisateur pour l'init de la DB                           |                                     |
| `chat.env.mongoInitPassword`                              | Password utilisateur pour l'init de la DB                      |                                     |
| `chat.env.mongoInitDatabase`                              | Nom de la DB pour l'init de la DB                              |                                     |
| `chat.env.mongoUser`                                      | Nom utilisateur de la DB                                       |                                     |
| `chat.env.mongoPassword`                                  | Passowrd de la DB                                              |                                     |
| `chat.env.mongoDatabase`                                  | Nom de la DB)                                                  |                                     |
| `chat.env.mongoLogLevel`                                  | Niveau de logging du POD                                       |                                     |
| `chat.env.sentryDsn`                                      | Nom datasource Sentry (DSN)                                    |                                     |
| `chat.autoscaling.enabled`                                | Active le l'autoscaling du service api                         | false                               |
| `chat.autoscaling.minReplicas`                            | Nombre minimum de réplica                                      | 1                                   |
| `chat.autoscaling.maxReplicas`                            | Nombre maximum de réplica                                      | 100                                 |
| `chat.autoscaling.targetCPUUtilizationPercentage`         | Cible d'utilisation du CPU                                     | 80                                  |
| `chat.service.type`                                       | Type de service api                                            | "CLusterIP"                         |
| `chat.service.port`                                       | Numéro de port du service                                      | 80                                  |
| `chat.service.wsPort`                                     | Numéro de port du service websocket                            | 8080                                |
| `chat.service.appPort`                                    | Numéro de port de l'application                                | 3000                                |
| `chat.service.appPortWs`                                  | Numéro de port de l'application websocket                      | 5000                                |
| `chat.probes.readiness.initialDelaySeconds`               | Durée avant d'effectuer la 1ère probe de`readiness`            | 0                                   |
| `chat.probes.readiness.periodSeconds`                     | Période entre les probes de`readiness`                         | 10                                  |
| `chat.probes.readiness.failureThreshold`                  | Nombre de tentative de la probe`readiness` avant d'abandonner  | 6                                   |
| `chat.probes.liveness.initialDelaySeconds`                | Durée avant d'effectuer la 1ère probe de`liveness`             | 0                                   |
| `chat.probes.liveness.periodSeconds`                      | Période entre les probes de`liveness`                          | 10                                  |
| `chat.probes.liveness.failureThreshold`                   | Nombre de tentative de la probe`liveness` avant d'abandonner   | 6                                   |
| `chat.ingress.enabled`                                    | Active l'exposition du service                                 | true                                |
| `chat.ingress.className`                                  | Nom du service ingress controller                              | "\*ingressName"                     |
| `chat.ingress.annotations.kubernetes.io/ingress.class`    | Nom du service ingress controller                              | "\*ingressName"                     |
| `chat.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer                                          | "letsencrypt"                       |
| `chat.ingress.annotations.kubernetes.io/tls-acme`         | Activate tls                                                   | true                                |
| `chat.ingress.hosts`                                      | Nom de l'hôte                                                  | [host: *chatUrl]                    |
| `chat.ingress.tls`                                        | Liste des hôtes                                                | \["\*chatUrl"\]                     |

<u>**Les variables de l'application Web:**</u>

| Name                                                        | Description                                                                  | Value                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| `webapp.name`                                               | Nom du pod et du sous domaine utilisé pour l'exposé.                         | "webapp"                          |
| `webapp.replicaCount`                                       | Nombre de réplica du service                                                 | 1                                 |
| `webapp.image.repository`                                   | Nom du repository et de l'image docker nginx                                 | "nginx"                           |
| `webapp.image.tag`                                          | Nom du tag de l'image docker                                                 | "1.25.2-alpine"                   |
| `webapp.image.pullPolicy`                                   | Pull policy de l'image docker                                                | "Always"                          |
| `webapp.initImage.repository`                               | Nom du repository et de l'image docker d'initialisation de l'application web | "rg.fr-par.scw.cloud/ulep/webapp" |
| `webapp.initImage.tag`                                      | Nom du tag de l'image docker                                                 | "latest"                          |
| `webapp.initImage.pullPolicy`                               | Pull policy de l'image docker                                                | "Always"                          |
| `webapp.pv.storage`                                         | Espace réservé par le service                                                | "4Gi"                             |
| `webapp.pv.storageClassName`                                | Storage class Name                                                           | ""                                |
| `webapp.autoscaling.enabled`                                | Active le l'autoscaling                                                      | false                             |
| `webapp.autoscaling.minReplicas`                            | Nombre minimum de réplica                                                    | 1                                 |
| `webapp.autoscaling.maxReplicas`                            | Nombre maximum de réplica                                                    | 100                               |
| `webapp.autoscaling.targetCPUUtilizationPercentage`         | Cible d'utilisation du CPU                                                   | 80                                |
| `webapp.service.type`                                       | Type de service                                                              | "CLusterIP"                       |
| `webapp.service.port`                                       | Numéro de port du service                                                    | 80                                |
| `webapp.probes.startup.initialDelaySeconds`                 | Durée avant d'effectuer la 1ère probe de`startup`                            | 30                                |
| `webapp.probes.startup.periodSeconds`                       | Période entre les probes de`startup`                                         | 10                                |
| `webapp.probes.startup.failureThreshold`                    | Nombre de tentative de la probe`startup` avant d'abandonner                  | 15                                |
| `webapp.probes.readiness.initialDelaySeconds`               | Durée avant d'effectuer la 1ère probe de`readiness`                          | 0                                 |
| `webapp.probes.readiness.periodSeconds`                     | Période entre les probes de`readiness`                                       | 10                                |
| `webapp.probes.readiness.failureThreshold`                  | Nombre de tentative de la probe`readiness` avant d'abandonner                | 3                                 |
| `webapp.probes.liveness.initialDelaySeconds`                | Durée avant d'effectuer la 1ère probe de`liveness`                           | 0                                 |
| `webapp.probes.liveness.periodSeconds`                      | Période entre les probes de`liveness`                                        | 5                                 |
| `webapp.probes.liveness.failureThreshold`                   | Nombre de tentative de la probe`liveness` avant d'abandonner                 | 3                                 |
| `webapp.ingress.enabled`                                    | Active l'exposition du service                                               | true                              |
| `webapp.ingress.className`                                  | Nom du service ingress controller                                            | "\*ingressName"                   |
| `webapp.ingress.annotations.kubernetes.io/ingress.class`    | Nom du service ingress controller                                            | "\*ingressName"                   |
| `webapp.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer                                                        | "letsencrypt"                     |
| `webapp.ingress.annotations.kubernetes.io/tls-acme`         | Activate tls                                                                 | true                              |
| `webapp.ingress.hosts`                                      | Nom de l'hôte                                                                | [host: *webappUrl]                |
| `webapp.ingress.tls`                                        | Liste des hôtes                                                              | \["\*webappUrl"\]                 |
| `webapp.env.viteEnv`                                        | Environnement                                                                |                                   |
| `webapp.env.viteSentryDsn`                                  | Nom datasource Sentry (DSN)                                                  |                                   |
| `webapp.env.viteChatUrl`                                    | Url du chat                                                                  |                                   |
| `webapp.env.viteSocketChatUrl`                              | Url du websocket du chat                                                     |                                   |

<u>**Les variables de Jitsi:**</u>
| Name | Description | Value |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| `jitsi-meet.name` | Nom du chart jitsi | jitsiUrl |
| `jitsi-meet.publicURL` | URL publique de l'instance Jitsi | "https://jitsi.ulep.thestaging.io" |
| `jitsi-meet.enableAuth` | Active l'authentification | true |
| `jitsi-meet.enableGuests` | Autorise les invités | false |
| `jitsi-meet.tz` | Timezone de l'application | Europe/Paris |
| `jitsi-meet.web.ingress.enabled` | Active l'ingress | true |
| `jitsi-meet.web.ingress.className` | Classe de l'ingress | ingressName |
| `jitsi-meet.web.ingress.annotations.kubernetes.io/ingress.class` | Annotation de la classe d'ingress | ingressName |
| `jitsi-meet.web.ingress.annotations.kubernetes.io/tls-acme` | Active le TLS ACME | "true" |
| `jitsi-meet.web.ingress.cert-manager.io/cluster-issuer` | Émetteur de certificat | letsencrypt |
| `jitsi-meet.web.ingress.hosts[0].host` | Nom d'hôte de l'ingress | jitsi.ulep.thestaging.io |
| `jitsi-meet.web.ingress.hosts[0].paths` | Chemins de l'ingress | ["/"] |
| `jitsi-meet.web.ingress.tls[0].secretName` | Nom du secret TLS | jitsi-tls |
| `jitsi-meet.web.ingress.tls[0].hosts` | Hôtes pour le TLS | [jitsi.ulep.thestaging.io] |
| `jitsi-meet.web.extraVolumes[0].name` | Nom du volume supplémentaire | "jitsi-meet-swp" |
| `jitsi-meet.web.extraVolumes[0].configMap.name` | Nom du ConfigMap | "jitsi-meet-swp" |
| `jitsi-meet.web.extraVolumes[0].configMap.items[0].key` | Clé du premier item ConfigMap | "custom-config.js" |
| `jitsi-meet.web.extraVolumes[0].configMap.items[0].path` | Chemin du premier item | "custom-config.js" |
| `jitsi-meet.web.extraVolumes[0].configMap.items[1].key` | Clé du second item ConfigMap | "custom-interface_config.js" |
| `jitsi-meet.web.extraVolumes[0].configMap.items[1].path` | Chemin du second item | "custom-interface_config.js" |
| `jitsi-meet.web.extraVolumeMounts[0].name` | Nom du premier montage | "jitsi-meet-swp" |
| `jitsi-meet.web.extraVolumeMounts[0].mountPath` | Chemin de montage | "/config/custom-config.js" |
| `jitsi-meet.web.extraVolumeMounts[0].subPath` | Sous-chemin | "custom-config.js" |
| `jitsi-meet.web.extraVolumeMounts[1].name` | Nom du second montage | "jitsi-meet-swp" |
| `jitsi-meet.web.extraVolumeMounts[1].mountPath` | Chemin de montage | "/config/custom-interface_config.js" |
| `jitsi-meet.web.extraVolumeMounts[1].subPath` | Sous-chemin | "custom-interface_config.js" |
| `jitsi-meet.jvb.UDPPort` | Port UDP pour le JVB | 30378 |
| `jitsi-meet.jvb.useHostPort` | Utilise le port de l'hôte | true |
| `jitsi-meet.jvb.publicIPs` | IPs publiques pour le JVB | [51.159.157.213] |
| `jitsi-meet.jvb.service.enabled` | Active le service JVB | true |
| `jitsi-meet.jvb.service.type` | Type de service | LoadBalancer |
| `jitsi-meet.jvb.securityContext.allowPrivilegeEscalation` | Autorise l'escalade de privilèges | false |
| `jitsi-meet.jvb.securityContext.seccompProfile.type` | Type de profil seccomp | "RuntimeDefault" |
| `jitsi-meet.jvb.securityContext.readOnlyRootFilesystem` | Système de fichiers en lecture seule | false |
| `jitsi-meet.jvb.securityContext.runAsNonRoot` | Exécution en non-root | false |
| `jitsi-meet.jvb.xmpp.user` | Utilisateur XMPP pour JVB | "ulep" |
| `jitsi-meet.jvb.xmpp.password` | Mot de passe XMPP pour JVB | "AZE123aze" |
| `jitsi-meet.prosody.persistence.enabled` | Active la persistance pour Prosody | false |
| `jitsi-meet.prosody.extraEnvs[0].name` | Variable d'environnement | "AUTH_TYPE" |
| `jitsi-meet.prosody.extraEnvs[0].value` | Type d'authentification | "jwt" |
| `jitsi-meet.prosody.extraEnvs[1].name` | Variable d'environnement | "JWT_APP_ID" |
| `jitsi-meet.prosody.extraEnvs[1].value` | ID de l'application JWT | "api" |
| `jitsi-meet.prosody.extraEnvs[2].name` | Variable d'environnement | "JWT_APP_SECRET" |
| `jitsi-meet.prosody.extraEnvs[2].value` | Secret JWT | keycloakClientSecret |
| `jitsi-meet.prosody.extraEnvs[3].name` | Variable d'environnement | "TURN_HOST" |
| `jitsi-meet.prosody.extraEnvs[3].value` | Hôte TURN | "ulep-coturn" |
| `jitsi-meet.prosody.extraEnvs[4].name` | Variable d'environnement | "TURN_PORT" |
| `jitsi-meet.prosody.extraEnvs[4].value` | Port TURN | "80" |
| `jitsi-meet.prosody.extraEnvs[5].name` | Variable d'environnement | "TURNS_HOST" |
| `jitsi-meet.prosody.extraEnvs[5].value` | Hôte TURNS | "ulep-coturn" |
| `jitsi-meet.prosody.extraEnvs[6].name` | Variable d'environnement | "TURNS_PORT" |
| `jitsi-meet.prosody.extraEnvs[6].value` | Port TURNS | "443" |
| `jitsi-meet.prosody.extraEnvs[7].name` | Variable d'environnement | "TURN_TTL" |
| `jitsi-meet.prosody.extraEnvs[7].value` | TTL TURN | "86400" |
| `jitsi-meet.prosody.extraEnvs[8].name` | Variable d'environnement | "TURN_USERNAME" |
| `jitsi-meet.prosody.extraEnvs[8].value` | Utilisateur TURN | "coturn" |
| `jitsi-meet.prosody.extraEnvs[9].name` | Variable d'environnement | "TURN_PASSWORD" |
| `jitsi-meet.prosody.extraEnvs[9].value` | Mot de passe TURN | "coturn" |
| `jitsi-meet.prosody.extraEnvs[10].name` | Variable d'environnement | "TURN_CREDENTIALS" |
| `jitsi-meet.prosody.extraEnvs[10].value` | Credentials TURN | "" |
| `jitsi-meet.prosody.extraEnvs[11].name` | Variable d'environnement | "TURN_TRANSPORT" |
| `jitsi-meet.prosody.extraEnvs[11].value` | Transport TURN | "tcp,udp" |
| `jitsi-meet.prosody.extraEnvs[12].name` | Variable d'environnement | "JVB_AUTH_USER" |
| `jitsi-meet.prosody.extraEnvs[12].value` | Utilisateur auth JVB | "ulep" |
| `jitsi-meet.prosody.extraEnvs[13].name` | Variable d'environnement | "JVB_AUTH_PASSWORD" |
| `jitsi-meet.prosody.extraEnvs[13].value` | Mot de passe auth JVB | "AZE123aze" |
| `jitsi-meet.prosody.extraEnvs[14].name` | Variable d'environnement | "JICOFO_AUTH_USER" |
| `jitsi-meet.prosody.extraEnvs[14].value` | Utilisateur auth Jicofo | "ulep" |
| `jitsi-meet.prosody.extraEnvs[15].name` | Variable d'environnement | "JICOFO_AUTH_PASSWORD" |
| `jitsi-meet.prosody.extraEnvs[15].value` | Mot de passe auth Jicofo | "AZE123aze" |
| `jitsi-meet.prosody.extraEnvs[16].name` | Variable d'environnement | "JICOFO_COMPONENT_SECRET" |
| `jitsi-meet.prosody.extraEnvs[16].value` | Secret composant Jicofo | "AZE123aze" |
| `jitsi-meet.prosody.annotations.reloader.stakater.com/match` | Annotation reloader | "true" |
| `jitsi-meet.prosody.securityContext.allowPrivilegeEscalation` | Autorise l'escalade de privilèges | false |
| `jitsi-meet.prosody.securityContext.seccompProfile.type` | Type de profil seccomp | "RuntimeDefault" |
| `jitsi-meet.prosody.securityContext.readOnlyRootFilesystem` | Système de fichiers en lecture seule | false |
| `jitsi-meet.prosody.securityContext.runAsNonRoot` | Exécution en non-root | false |
| `jitsi-meet.prosody.extraVolumes[0].name` | Nom du volume Prosody | "jitsi-meet-swp" |
| `jitsi-meet.prosody.extraVolumes[0].configMap.name` | Nom du ConfigMap Prosody | "jitsi-meet-swp" |
| `jitsi-meet.prosody.extraVolumes[0].configMap.items[0].key` | Clé de configuration Prosody | "jitsi-meet.cfg.lua" |
| `jitsi-meet.prosody.extraVolumes[0].configMap.items[0].path` | Chemin de configuration Prosody | "jitsi-meet.cfg.lua" |
| `jitsi-meet.prosody.extraVolumeMounts[0].name` | Nom du montage Prosody | "jitsi-meet-swp" |
| `jitsi-meet.prosody.extraVolumeMounts[0].mountPath` | Chemin de montage Prosody | "/defaults/conf.d/jitsi-meet.cfg.lua" |
| `jitsi-meet.prosody.extraVolumeMounts[0].subPath` | Sous-chemin de montage Prosody | "jitsi-meet.cfg.lua" |
| `jitsi-meet.jicofo.xmpp.user` | Utilisateur XMPP Jicofo | "ulep" |
| `jitsi-meet.jicofo.xmpp.password` | Mot de passe XMPP Jicofo | "AZE123aze" |
| `jitsi-meet.jibri.enable` | Active le service Jibri | false |
| | | |

<u>**Les variables du git:**</u>
| Name | Description | Value |
| --------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| `git.name` | Nom du pod et du sous domaine utilisé pour l'exposé. | "git" |
| `git.replicaCount` | Nombre de réplica du service | 1 |
| `git.image.repository` | Nom du repository et de l'image docker | "rockstorm/git-server" |
| `git.image.tag` | Nom du tag de l'image docker | "latest" |
| `git.image.pullPolicy` | Pull policy de l'image docker | "IfNotPresent" |
| `git.env.minioHost` | Host du minio | |
| `git.env.minioAccessKey` | Access key du minio | |
| `git.env.minioSecretKey` | Secret key du minio | |
| `git.env.gitPassword` | Password du user git | |
| `git.autoscaling.enabled` | Active le l'autoscaling du service api | false |
| `git.autoscaling.minReplicas` | Nombre minimum de réplica | 1 |
| `git.autoscaling.maxReplicas` | Nombre maximum de réplica | 100 |
| `git.autoscaling.targetCPUUtilizationPercentage` | Cible d'utilisation du CPU | 80 |
| `git.service.type` | Type de service api | "CLusterIP" |
| `git.service.port` | Numéro de port du service | 80 |
| `git.ingress.enabled` | Active l'exposition du service | true |
| `git.ingress.className` | Nom du service ingress controller | "\*ingressName" |
| `git.ingress.annotations.kubernetes.io/ingress.class` | Nom du service ingress controller | "\*ingressName" |
| `git.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer | "letsencrypt" |
| `git.ingress.annotations.kubernetes.io/tls-acme` | Activate tls | true |
| `git.ingress.hosts` | Nom de l'hôte | [host: *chatUrl] |
| `git.ingress.tls` | Liste des hôtes | \["\*chatUrl"\] |

<u>**Les variables du weblate:**</u>
| Name | Description | Value |
| --------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| `weblate.name` | Nom du pod et du sous domaine utilisé pour l'exposé. | "weblate" |
| `weblate.replicaCount` | Nombre de réplica du service | 1 |
| `weblate.image.repository` | Nom du repository et de l'image docker | "rg.fr-par.scw.cloud/ulep/api-prod" |
| `weblate.image.tag` | Nom du tag de l'image docker | "latest" |
| `weblate.image.pullPolicy` | Pull policy de l'image docker | "IfNotPresent" |
| `weblate.env.site` | Host de weblate | |
| `weblate.env.serverEmail` | mail par défaut pour envoyer des mails | |
| `weblate.env.defaultFromEmail` | mail par défaut pour envoyer des mails | |
| `weblate.env.emailHost` | host du server demail | |
| `weblate.env.adminEmail` | Mail de l'admin | |
| `weblate.env.adminPassword` | Password du mail de l'admin | |
| `weblate.env.emailHostUser` | User du mail du host | |
| `weblate.env.emailHostPassword` | Password du mail du host | |
| `weblate.env.emailPort` | Port du server de mail | |
| `weblate.env.allowedHost` | Host autorisé | |
| `weblate.autoscaling.enabled` | Active le l'autoscaling du service api | false |
| `weblate.autoscaling.minReplicas` | Nombre minimum de réplica | 1 |
| `weblate.autoscaling.maxReplicas` | Nombre maximum de réplica | 100 |
| `weblate.autoscaling.targetCPUUtilizationPercentage` | Cible d'utilisation du CPU | 80 |
| `weblate.service.type` | Type de service api | "CLusterIP" |
| `weblate.service.port` | Numéro de port du service | 80 |
| `weblate.ingress.enabled` | Active l'exposition du service | true |
| `weblate.ingress.className` | Nom du service ingress controller | "\*ingressName" |
| `weblate.ingress.annotations.kubernetes.io/ingress.class` | Nom du service ingress controller | "\*ingressName" |
| `weblate.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer | "letsencrypt" |
| `weblate.ingress.annotations.kubernetes.io/tls-acme` | Activate tls | true |
| `weblate.ingress.hosts` | Nom de l'hôte | [host: *chatUrl] |
| `weblate.ingress.tls` | Liste des hôtes | \["\*chatUrl"\] |

<u>**Les variables du glitchtip:**</u>
| Name | Description | Value |
| --------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| `glitchtip.name` | Nom du pod et du sous domaine utilisé pour l'exposé. | "glitchtip" |
| `glitchtip.image.repository` | Nom du repository et de l'image docker | "rg.fr-par.scw.cloud/ulep/api-prod" |
| `glitchtip.image.tag` | Nom du tag de l'image docker | "latest" |
| `glitchtip.image.pullPolicy` | Pull policy de l'image docker | "IfNotPresent" |
| `glitchtip.normal.env.GLITCHTIP_DOMAIN` | Host de glitchtip | |
| `glitchtip.normal.env.EMAIL_URL` | url du server de mail | |
| `glitchtip.normal.env.DEFAULT_FROM_EMAIL` | avec quel adresse envoyer un email | |
| `glitchtip.normal.env.ENABLE_USER_REGISTRATION` | autorisé les nouveaux users | |
| `glitchtip.web.ingress.enabled` | Active l'exposition du service | true |
| `glitchtip.web.ingress.className` | Nom du service ingress controller | "\*ingressName" |
| `glitchtip.web.ingress.annotations.kubernetes.io/ingress.class` | Nom du service ingress controller | "\*ingressName" |
| `glitchtip.web.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer | "letsencrypt" |
| `glitchtip.web.ingress.annotations.kubernetes.io/tls-acme` | Activate tls | true |
| `glitchtip.web.ingress.hosts` | Nom de l'hôte | [host: *chatUrl] |
| `glitchtip.web.ingress.tls` | Liste des hôtes | \["\*chatUrl"\] |
<u>**Les variables de TURN:**</u>
| Name | Description | Value |
| --------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
|`coturn.realm` |point d'entrée du realm | turn.ulep.thestaging.io|
|`coturn.name` |nom du déploiement | coturn|
|`coturn.exernalDatabse.enabled` | si on veut utiliser une base de données externes au pod |false |
|`coturn.postgresql.enabled` |si on veut utiliser une base postgres au lieu de SQLite |false |
|`coturn.auth.username` |username d'authentification | coturn|
|`coturn.auth.password` |password d'authentification | coturn|
|`coturn.auth.existingSecret` | si un secret corturn existe deja|<chaine vide> |


### <u>Déployer les services</u>

Après avoir remplis le fichier values.yaml correctement vous pourrez passer au déploiement.

Dans le dossier `helm/project/` lancer la commande suivante:

`helm install ulep . --create-namespace -n ulep`

Le déploiement se passe de la manière suivante:

- La base de donnée se met en place avec minio.
- Le back office et l'api attendent que la base de donnée soit prête.
- Le back-office et l'api démarrent.

### <u>Mise à jour des services</u>

Il est possible de mettre à jour les services existants en déployant une nouvelle version du chart helm.
Cela permet de déployer le chart Helm en utilisant une nouvelle configuration (ex: changement du chart en lui même, changement dans les valeurs passées au chart).

```sh
helm upgrade ulep .
```

**Pour le cas particulier d'une montée de version applicative, il suffit généralement de :**

- Changer la version que vous souhaitez déployer dans le fichier `values.yaml` (ex: `api.image.tag` pour l'API)
- Réaliser une upgrade du chart `helm upgrade ulep .`

### <u>Désinstaller le service</u>

`helm uninstall ulep -n ulep`

Cette commande ne supprime pas les volumes, relancer les services à nouveau conserve alors les données.

### Note globale sur Helm

[Helm](https://helm.sh/docs/) est l'outil utilisé pour packager les applicatifs dans un environnement Kubernetes. Il intègrent un ensemble de fonctionnalité utiles pour effectuer des opérations sur les déploiements de ces applicatifs (ex: rollback d'une version, montée de version progressive, etc).

Référez vous à la documentation pour plus d'informations.
