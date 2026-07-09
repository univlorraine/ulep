# Déploiement des services de traduction

Les services de traductions comprennent les briques suivantes: 
- **Weblate**: Service exposé pour y ajouter des traductions
- **Redis**: Service de cache
- **Base de donnée Postgres**: Non exposé, elle stocke les données utilisateurs.

Toute cette partie se trouve dans le dossier `helm/weblate`

## <u>Préparer le déploiement</u>

Tout d'abord il faut copier le fichier `values.yaml.tmp` vers `values.yaml`

### <u>Comprendre et remplir le fichier `values.yaml`</u>

Le fichier `values.yaml` sert à définir les variables pour l'instance que l'on souhaite monter.

Il est séparé en plusieurs parties:

<u>**Les variables globales:**</u>

| Name | Description | Value |
| ---- | ----------- | ----- |
| `name` | Nom du projet, utiliser dans les noms des objets kubernetes | "ulep-weblate" |
| `domain` | Nom de domaine utilisé pour rendre accessible les services. Les services utiliserons des sous domaines. | "" |
| `issuerName` | Nom du cluster issuer mis en place dans [cette étape](clusterIssuer) | "letsencrypt" |
| `global.postgresql.auth.username` | Configurer le nom de l'utilisateur de la base de donnée | "weblate" |
| `global.postgresql.auth.database` | Configurer le nom de la base de donnée | "weblate" |
| `global.postgresql.auth.password` | Configurer le mot de passe de l'utilisateur personnalisé | "" |
| `global.redis.password` | Configurer le mot de passe de redis | "" |


<u>**Les variables Weblate:**</u>

| Name | Description | Value |
| ---- | ----------- | ----- |
| `weblate.name` | Nom du pod et du sous domaine utilisé pour l'exposé. | "weblate" |
| `weblate.replicaCount` | Nombre de réplica du service | 1 |
| `weblate.image.repository` | Nom du repository et de l'image docker | "weblate/weblate" |
| `weblate.image.tag` | Nom du tag de l'image docker | "4.18" |
| `weblate.image.pullPolicy` | Pull policy de l'image docker | "IfNotPresent" |
| `weblate.env.siteDomain` | Sous domaine utilisé pour le service de weblate | "weblate" |
| `weblate.env.serverEmail` | Email utilisé par weblate pour envoyer des notification nécessaire au bon fonctionnement | "" |
| `weblate.env.emailHost` | Server mail smtp  | "" |
| `weblate.env.emailHostUser` | Nom de l'utilisateur (permettant l'accès au serveur smtp). En cas d'utilisation de MailJet on renseigne ici la clé public de l'api key généré. | "" |
| `weblate.env.emailHostPassword` | Mot de passe de l'utilisateur (permettant l'accès au serveur smtp). En cas d'utilisation de MailJet on renseigne ici la clé privé de l'api key généré. | "" |
| `weblate.env.emailPort` | Port utiliser pour se connecter au server smtp | 587 |
| `weblate.env.allowedHost` | Permet de résoudre les problèmes de cors | "*" |
| `weblate.env.adminPassword` | Mot de passe de l'administrateur (Premier utilisateur) | "" |
| `weblate.autoscaling.enabled` | Active la réplication automatique des pods | false |
| `weblate.autoscaling.minReplicas` | Nombre minimum de réplica | 1 |
| `weblate.autoscaling.maxReplicas` | Nombre maximum de réplica | 100 |
| `weblate.autoscaling.targetCPUUtilizationPercentage` | Cible d'utilisation du CPU | 80 |
| `weblate.service.type` | Type de service weblate | "CLusterIP" |
| `weblate.service.port` | Numéro de port du service | 80 |
| `weblate.resources.port` | Numéro de port du resources | 80 |
| `weblate.resources.limits.cpu` | Limite de cpu | "3" |
| `weblate.resources.limits.memory` | Limite de mémoire | 4000Mi |
| `weblate.resources.requests.cpu` | Minimum cpu requis  | "2" |
| `weblate.resources.requests.memory` | Minimum requis mémoire | 3000Mi |
| `weblate.ingress.enabled` | Active l'exposition du service | true |
| `weblate.ingress.className` | Nom du service ingress controller | "treafik" |
| `weblate.ingress.annotations.kubernetes.io/ingress.class` | Nom du service ingress controller | "traefik" |
| `weblate.ingress.annotations.cert-manager.io/cluster-issuer` | Nom du cluster issuer | "letsencrypt" |
| `weblate.ingress.annotations.kubernetes.io/tls-acme` | Activate tls | true |
| `weblate.ingress.hosts` | Nom de l'hôte | [host: weblate] |
| `weblate.ingress.tls` | Liste des hôtes | \["weblate"\] |

### <u>Déployer les services</u>

Après avoir remplis le fichier values.yaml correctement vous pourrez passer au déploiement.

Dans le dossier `helm/weblate/` lancer la commande suivante:

`helm install ulep-weblate . --create-namespace -n ulep`

### <u>Désinstaller le service</u>

`helm uninstall ulep-weblate -n ulep`

Cette commande ne supprime pas les volumes, relancer les services à nouveau conserve alors les données.
