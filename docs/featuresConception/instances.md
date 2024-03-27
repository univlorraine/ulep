# Instances

Ce document est une proposition pour gérer le déploiement en marque blanche de l'application ULEP par d'autres universités.

On appelera une "instance" une instanciation de l'application par une université centrale.

## Fonctionnement

Il a été convenu que :

- Une même application mobile serait utilisé par tous les utilisateurs
- Chaque instance aurait sa propre application Web, API, back-office, serveur d'authentification et BDD.

Pour accéder à l'application web il sera communiqué une URL menant directement à l'application web de l'instance. Celle-ci sera configuré pour pointer vers les éléments logiciels de sa propre instance (API et serveur d'auth).

L'application mobile embarquera une page de sélection des instances, permettant à l'utilisateur de choisir sur quel instance il souhaite se connecter.
A la sélection d'une instance l'URL de l'API associée est définie, permettant de récupérer la configuration associée (e.g. couleurs de l'app, universités, etc). Le parcours se fera ensuite sur l'application configurée pour l'instance choisie.

```plantuml
actor user
participant "Mobile app" as app
participant api
participant bdd
participant "Dépot traductions" as gitlab

== Initialization ==

user -> app++: charge l'application
return application avec valeurs par défaut

user -> app++: sélectionne l'instance
    note right
        La sélection de l'instance
        défini l'URL de l'API
    endnote

    app -> api++: Récupère la configuration associée
        api -> bdd++: récupère la configuration
        return configuration
    return configuration

    app -> api++: Récupère les traductions pour le language et l'instance
        api -> gitlab++: Récupère le fichier de traduction associé
        return traductions
    return traductions

    app -> app: reload avec traductions de l'instance
    note right
        En cas d'erreur, on utilise les traductions
        embarquées dans l'app
    endnote


return app configurée pour l'instance

== Inscription ==

user -> app++: Clique sur inscription
    app -> api++: Récupère les universités
        api -> bdd++: Récupère les universités
        return universités
    return universités
return page d'inscription

note over app
    Etc pour la suite du parcours
endnote

```

### Focus sur les traductions

Les traductions sont gérés différemment suivant l'élément logiciel:

1. App/webapp et API: les traductions sont chargés dynamiquement depuis le endpoint Gitlab/Github du dépot contenant les traductions. L'app embarque des traductions au build pour les éléments avant sélection d'instance ou si pb lors de la récupération dynamique.

```plantuml
participant "Mobile app" as app
participant api
participant "Dépot traductions" as gitlab
== App et webapp ==
app -> app: Démarre avec les traductions embarquées au build
app -> api++: Récupère les traductions pour le language et l'instance
    api -> gitlab++: Récupère le fichier de traduction associé
    return traductions
return traductions

== Api ==
app -> api++: Action qui nécessite traduction côté API (e.g. envoi email)
    api -> gitlab++: Récupère les traductions pour le language et l'instance
    return traduction
    api -> api: effectue action demandée
return OK
```

2. Admin et serveur d'authentification (i.e. Keycloak): les traductions embarquées au build des applications.

```plantuml
actor user
participant admin
participant "Serveur d'auth" as auth
== Auth ==
user -> auth++: demande une action nécessitant une traduction
    note right
        Seul la page d'oubli de mot de passe
        et l'envoie de mail de réinitialisation du
        mdp sont dans Keycloak
    endnote
    auth -> auth: effectue l'action et traduit avec les messages embarqués au build
return OK

== backoffice ==
user -> admin++: charge le back-office
    admin -> admin: utilise ses traductions embarquées au build
return OK
```

Note: optimisation possible en mettant du cache au niveau de l'API.
Note: l'API a des traductions statique à date (18/03/2024).

## Création d'une nouvelle instance

Pour créer une nouvelle instance il faut déployer une BDD, un serveur MinIO, l'API, le back-office et Keycloak.

Cela peut être fait:

- Soit par UL dans son cluster Kubernetes.
- Soit par l'université centrale de la nouvelle instance sur son cluster Kubernetes.

Pour cela, il faut installer une nouvelle release du chart "projet" avec les valeurs nécessaires.

Note: l'université centrale devra également déployer sa propre instance de Glitchtip, Weblate et autre outils annexes si elle souhaite les utiliser.

### Intégration de l'instance dans l'app mobile

Les instances sélectionables dans l'application mobile sont définies dans le code de l'application mobile.

Pour rendre une nouvelle instance sélectionnable dans l'app mobile il faudra donc :

1. Demander à UL d'ajouter l'instance dans l'app. Pour cela il faut l'URL de l'API de la nouvelle instance, le logo de l'instance ainsi que le nom.
2. Re-builder et déployer une nouvelle version de l'app.

### Focus sur les traductions

Le dépôt contenant les traductions devra être "forké" par l'université partenaire. Elle pourra ainsi changer les traductions qu'elle souhaite.

Les endpoints récupérant les traductions seront à mettre à jour vers le endpoint de ce nouveau dépôt pour les traductions (configuration à faire au niveau de l'API).

Note: les traductions de Keycloak étant embarquées au build, il sera nécessaire de builder une nouvelle version de l'image Docker du thème Keycloak pour configurer les traductions. C'est cette image qu'il faudra déployer lors de l'installation de la release.

### Schéma architecture

L'architecture dépendra de comment est instancié la nouvelle instance. Ci-dessous les cas d'une instance ayant son propre cluster Kubernetes.

```plantuml
actor user

component app as "Mobile app" {
}
user --> app: Utilisateur charge l'app

node UL {
    node k8sUL as "cluster k8s UL" {
        package ulPublic as "*.univ-lorraine.fr" {
            app --> apiUL: Quand instance "UL" sélectionnée

            component webUL as "Web app" {
            }
            user --> webUL: accès direct avec URL webapp UL
            webUL --> apiUL

            component boUL as "Back-office" {
            }
            boUL --> apiUL

            component apiUL as "API" {
            }

            component authUL as "Auth" {
            }
            apiUL ..> authUL: redirection auth

            component weblateUL as "Weblate" {
            }
        }

        authUL ..> bddUL

        component bddUL as "BDD" {
        }
        apiUL ..> bddUL

        component s3UL as "MinIO" {
        }
        apiUL ..> s3UL
    }

    component repoTradsUL as "Dépot traductions" {
    }
    apiUL ..> weblateUL: découvre et récupère trads depuis API
    weblateUL ..> repoTradsUL: Modifie
}

node instanceA as "instance A" {
    node instanceAk8s as "Cluster k8s instance A" {
        package instanceAPublic as "*.univ-instance-a.fr" {
            app --> apiInstanceA: Quand instance "A" sélectionnée

            component webInstanceA as "Web app" {
            }
            user --> webInstanceA: accès direct avec URL webapp instance A
            webInstanceA --> apiInstanceA

            component boInstanceA as "Back-office" {
            }
            boInstanceA --> apiInstanceA

            component apiInstanceA as "API" {
            }

            component authInstanceA as "Auth" {
            }
            apiInstanceA ..> authInstanceA: redirection auth

            component weblateInstanceA as "Weblate" {
            }
        }
        authInstanceA ..> bddInstanceA

        component bddInstanceA as "BDD" {
        }
        apiInstanceA ..> bddInstanceA


        component s3InstanceA as "MinIO" {
        }
        apiInstanceA ..> s3InstanceA
    }

    component repoTradsInstanceA as "Dépot traductions" {
    }
    apiInstanceA ..> weblateInstanceA: découvre et récupère trads depuis API
    weblateInstanceA ..> repoTradsInstanceA: modifie
}
```

Note: Glitchtip a été omit du schéma pour permettre une meilleure lisibilité

Note: dans le cas d'une nouvelle instance sur le même cluster Kubernetes, le schéma serait globalement identique. Le bloc "Cluster k8s instance A" serait dans le bloc "cluster k8s UL", les éléments serait séparés à l'intérieur du cluster k8s via des namespaces différents (automatiquement fait par la release Helm).

## Gestion des évolutions

### Synchronisation des versions

En cas de changement majeur (i.e. "breaking changes"), il est important d'avoir les versions des instances et de l'app mobile synchronisées.

En cas de changement dans les traductions, il sera nécessaire pour les instances de rappatrier les changements de traductions dans leur "fork" du dépôt de traduction.
