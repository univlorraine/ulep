# Prérequis avant le lancement d'une nouvelle instance

## Prérequis technique

Pour les 2 déploiements, Projet et Weblate.

Minimum:
- **CPU**: 2
- **Mémoire**: 6Go

Recommandé:
- **CPU**: 4
- **Mémoire**: 8Go

L'espace disque dépendra principalement du nombre d'utilisateur et des images qu'ils téléverserons.

## Services prérequis

Actuellement weblate nécessite de se connecter à un service mail pour permettre l'autentification.
Si vous ne disposez pas de service mail, nous recommendons [MailJet](https://www.mailjet.com/).

[Mettre en place Mailjet](Mailjet)

## <u>Nom de domaine</u>

Les services suivants nécessitent une connexion HTTPS et donc un nom de domaine.

- Authentification (Keycloak)
- Stockage d'objets (Minio)
- Api
- Traduction (Weblate)
- Back office (Admin)
- Web app (Application en ligne)

## <u>Cluster Kubernetes</u>

Avant de pouvoir déployer les services via Helm il faudra mettre en place un cluster Kubernetes avec cert-manager, un ingress controller près installé (traefik recommandé) ainsi qu'un clusterIssuer permettant la vérification des certificats.

[Comment déployer cert-manager ?](cert-manager)

[Comment déployer l'ingress controller ?](ingressController)

[Comment déployer le cluster issuer ?](clusterIssuer)