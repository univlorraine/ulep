# Sauvegarde des données du système

Cette page décrit comment effectuer des sauvegardes des données applicatives du système.

## IMPORTANT

Les éléments stockant des données applicatives sont déjà répliqués à l'intérieur du cluster Kubernetes.
Les sauvegardes décrites dans cette page ont donc pour but de restaurer le système en cas de désastre au niveau du cluster Kubernetes et/où de l'infrastructure sur lequel il est hebergé.

**Afin de ne pas perdre les sauvegardes en cas de désastre sur votre SI, il est important de stocker les sauvegardes en dehors de votre SI**. Par exemple sur du cloud où sur une autre infrastructure physique.

## Base de données

La base de données contient la plupart des données applicatives. Il s'agit ici d'un cluster PostgreSQL déployé à l'aide du chart [bitnami Postgresql](https://artifacthub.io/packages/helm/bitnami/postgresql).

**Important: l'utilisateur doit avoir les droits superutilisateur (afin de réaliser une sauvegarde complète et de pouvoir créer les users/groupes/tables lors de l'import du fichier généré)**

### Sauvegarde du cluster

Il est possible de créer un fichier de sauvegarde du cluster PostgreSQL à l'aide de la commande `pg_dumpall`.

La commande s'utilise comme cela :
```sh
PGPASSWORD=password pg_dumpall -h host -p port -U user > fileName
```

Par exemple: `PGPASSWORD=Test1234 pg_dumpall -h localhost -p 5432 -U postgres > dump-25_10_23-14_00.sql`

### Restaurer une sauvegarde

La restauration d'une sauvegarde doit se faire sur une nouvelle instance. Celle-ci ré-importera toutes les tables et données présentes dans le cluster au moment de la sauvegarde. La restauration se fait à l'aide de la commande `psql`.

La commande s'utilise comme cela :
```sh
PGPASSWORD=password psql -h host -p port -U user -f fileName
```

### Recommendation pour l'automatisation des backups dans le cluster kubernetes

Vous pouvez automatiser la création de la sauvegarde de la base de données à l'aide d'un CRON. 

Il est pour cela possible de définir un [cron kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/). Celui-ci incorporant le client postgresql afin de réaliser le dump. Le cron doit ensuite uploader le fichier généré en dehors de votre infrastructure (i.e. dans un autre bucket si sur le cloud ou sur une autre instance physique si on-premises).

## MinIO

MinIO stocke principalement les avatars des utilisateurs et les assets (ex: images des emails).

### Pré-requis

Il est nécessaire d'avoir [minio client](https://min.io/docs/minio/linux/reference/minio-mc.html) d'installé afin d'effectuer les opérations qui suivent.

Le client permet d'interagir avec MinIO de la même manière qu'avec les commandes UNIX.

Pour définir un alias vers un serveur/cluster minIO:
```sh
mc alias set $ALIAS_NAME $MINIO_HOST $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
```

Par example: `mc alias set local http://localhost:9000 minio minio_password


### Extraction des données

Pour copier l'entièreté des données depuis un minIO on peut utiliser la commande `mc cp`.

```sh
mc cp -r $ALIAS_NAME $PATH_WHERE_TO_REPLICATE
```

Exemple: `mc cp -r local ./tmp/data_minio-25_10_23`

On peut ensuite créer une archive compressée des fichiers au besoin.

### Import des données

On peut utiliser les commandes `mc mb` et `mc cp` pour respectivement créer des buckets et copier des éléments dedans.

Créer un bucket
```sh
mc mb $ALIAS_NAME/$BUCKET_NAME
```

Copier des éléments dans un bucket
```sh
mc cp -r $FOLDER_NAME $ALIAS_NAME/$BUCKET_NAME
```

Note: les politiques des buckets doivent être créés manuellement.

### Recommendation pour l'automatisation de la sauvegarde

Vous pouvez automatiser la création de la sauvegarde de la base de données à l'aide d'un CRON. 

Il est pour cela possible de définir un [cron kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/). Celui-ci incorporant le client minio afin de copier les buckets et données associées.. Le cron doit ensuite créer une archie et l'uploader en dehors de votre infrastructure (i.e. dans un autre bucket si sur le cloud ou sur une autre instance physique si on-premises).

### Alternative pour assurer la pérénité des données de MinIO en cas de désastre de l'infrastructure

Il est également possible de mettre en place du "mirroring" de MinIO vers un autre site MinIO (hebergé dans un autre cluster Kubernetes).