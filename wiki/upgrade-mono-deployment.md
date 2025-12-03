# Migration de l'infrastructure Kubernetes basée sur Helm

## Objectif

Ce document explique les étapes nécessaires pour migrer d'une infrastructure Kubernetes existante, composée de trois déploiements Helm distincts (Weblate, Glitchtip, et ulep), vers une nouvelle infrastructure où Weblate et Glitchtip sont intégrés dans le déploiement unique d'ulep.

## Vue d'ensemble

### Ancienne infrastructure

- **Weblate** : déployé via un chart Helm dédié.
- **Glitchtip** : déployé via un chart Helm dédié.
- **Ulep** : déployé via un chart Helm distinct.

### Nouvelle infrastructure

- Un unique déploiement Helm gère les trois composants :
  - **Weblate**
  - **Glitchtip**
  - **Ulep**

## Étapes de migration

### 1. Sauvegarde des données existantes

Avant toute modification, il est impératif de sauvegarder les données de Weblate et Glitchtip pour éviter toute perte.

#### Sauvegarde de Weblate

1. Connectez-vous au pod Weblate :
   ```bash
   kubectl exec -it <pod-weblate> -- /bin/bash
   ```
2. Effectuez une sauvegarde de la base de données :
   ```bash
   pg_dump -h <host-db> -U <user-db> -d <nom-db> > /backup/weblate_backup.sql
   ```
3. Sauvegardez les fichiers statiques :
   ```bash
   tar -czvf /backup/weblate_static_files.tar.gz /app/data
   ```
4. Récupérez les fichiers de sauvegarde depuis le pod :
   ```bash
   kubectl cp <pod-weblate>:/backup ./backup
   ```

#### Sauvegarde de Glitchtip

1. Connectez-vous au pod Glitchtip :
   ```bash
   kubectl exec -it <pod-glitchtip> -- /bin/bash
   ```
2. Sauvegardez la base de données :

   ```bash
   pg_dump -h <host-db> -U <user-db> -d <nom-db> > /backup/glitchtip_backup.sql
   ```

3. Récupérez les fichiers de sauvegarde depuis le pod :
   ```bash
   kubectl cp <pod-glitchtip>:/backup ./backup
   ```

### 2. Désinstallation des anciens déploiements

Une fois les sauvegardes effectuées, vous pouvez désinstaller les déploiements Helm de Weblate et Glitchtip.

#### Désinstallation de Weblate

```bash
helm uninstall <nom-release-weblate> -n <namespace>
```

#### Désinstallation de Glitchtip

```bash
helm uninstall <nom-release-glitchtip> -n <namespace>
```

### 3. Mise à jour du déploiement ulep

Le déploiement d'ulep doit être mis à jour pour inclure Weblate et Glitchtip.

#### Mise à jour via Helm

1. Mettez à jour les valeurs du fichier `values.yaml` pour intégrer Weblate et Glitchtip.
   Exemple :

   ```yaml
    # Default values for etandem.
    # This is a YAML-formatted file.
    # Declare variables to be passed into your templates.

    # CLUSTER
    name: "ulep"
    domain: &domain ulep.fr
    issuerName: letsencrypt
    ingressName: &ingressName traefik

    # API
    apiUrl: &apiUrl api
    firebaseProjectId: &firebaseProjectId ulep-notifications
    firebasePrivateKey: &firebasePrivateKey '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0EDoYaG4ioNVx\n1Jk3JPtumkG8sTZxDeWnz93Tt9QTbKQXR1JZFcwUay6cj2sgvVvZvXQEO87suu4M\nY0HN6t55O+AmEVa3Di4jwm5tqXv4Y9jX08iybHM4DXNK2AQeAL37Xyhwx4A+PhKi\n8//HklxPP93a3FglroHWJDOGyKdRsX4sPzjjU3a7cEOhu/r2lidJ5z6i0/WUYc4e\nuRvw7ehG0QjsEle5Xqk1Qk5cHvY9+t1l2xz0I75KQPASCOgWfI5Xdcz7gRA2euCa\n85wLe8D80SzT5aPB7Ig8ljcbt8521GHKBGyxMp6vxj/MZz5FvPPGMynyY34NWhvs\nwmwaFXrpAgMBAAECggEAFKcr0rLftw8VjFnjPQT75eLBmYAGC4+ZgNcBzY/vPk8e\nvyDKHDe40bq9fO2iTv4JM/9b+ERX5qVGOpuD57eBzwwEGLmyZYq11houClv/QS1K\nqO68vWJdENfSGoqOZlaVc+ilPdJULk92WcR82Qo7lkdwDfNqFOBgOgyq8FHBh0gQ\nL/kA/EmPvUUpecxWQqr1JageRh93jk3BSaKgUwIAnLcUwom9Qn8XO/O7KqLeguUP\nmvS++YIC9tNLS9vJ92f/+Ns8+7UWdZzqPgEE5UD7Ba7xvgw1wQPpIHMt/YmXUBab\nrJqW6ADdpfw2p3aZJbamPaxhmVfYRzpyUuAgY3/u9QKBgQDgwJiN4WbQ3FJd+Nv8\nVjYlmfMHbX8F0WPOfIlZbn2R1SeAg/2A1qezanGhg2ukG3RO547TN9t0l4it94E/\n1VRupr/I2t+Ibmpbc7TbxzAjYSsU3oV+tF5h8F2eOtgm26RNMtIojOvKF4g+QDtB\nXP/+ul8UnS+dviJGqpFKj9PFOwKBgQDNGQ7zBr3jUIbvVT1OdDJgrtrqEB4D1Byh\nAyW28WHx4sXrYv1zIIx3nN/k7Kf5oYkYAu9Id31MFm1mD8yge6qUeUKsZpRyePky\nVN8XPKMP+t7z7Wh2EJkCOFJlkMD5qIpfEG1eyZfLM0U8/IxqA672MXB1uJjvBOq+\nxUI33AxuKwKBgFDyjP9s008eSzw1SWYU1uOsEu/16+34gG36RK3FMcy4bMXIxCEH\nLtdb2xlE8BvnF3jjxXklgRD5Eu01W4PWHdbMj/6Tdjb5La1KezU9BIV5lb6qdoIw\nDF5R6CX5I6i7Ku3zA+Y++x2KZDOnhrAAAuOH1H7kLiYuOMIi5LlqG+fJAoGAPxc2\nQgwQ3Zwn5feSpE+aL6OaM+ZBVWwqYl1VfLFEL+RSfdY1oPSiQSlAtmsWQPQv9/Lv\nKJuZL462mG7Dw5pHHuUuXVow0AXmolT5S2ybvI6vhtnBCJCSgNxSfGvK8QGnjxa+\njin1R8y9v8TwbKw1ZgZPUec3JE+e5pBHjmdia4ECgYBu19D0n37HsF6/xdRShQKA\ntm1s/5WXXQvNdN5CXtyWvKWfmVZz6mnm4f3T7pFg1cOHXumol9FQ7/OLbOdMc1QL\nf1fpw4I8O55WotsI9I/G/DCNYlRbI47L/0vEYLE6r9ht4usYo7FCuNGEEzBfyHBc\nm1ri7rtcn3xrDQNDximZVA==\n-----END PRIVATE KEY-----\n'
    firebaseClientEmail: &firebaseClientEmail firebase-adminsdk-l8blg@ulep-notifications.iam.gserviceaccount.com

    # AUTH
    authUrl: &authUrl auth

    # JITSI
    jitsiUrl: &jitsiUrl jitsi

    # ADMIN
    adminUrl: &adminUrl admin

    # CHAT
    chatUrl: &chatUrl chat
    socketChatUrl: &socketChatUrl chat-ws

    # MINIO
    minioApiUrl: &minioApiUrl minio-api
    minioUrl: &minioUrl minio
    minioAccessKey: &minioAccessKey minio
    minioSecretKey: &minioSecretKey password

    # KEYCLOAK
    keycloakUrl: &keycloakUrl auth
    keycloakAdminPassword: &keycloakAdminPassword password
    keycloakClientSecret: &keycloakClientSecret secret

    # WEBAPP
    webappUrl: &webappUrl webapp

    #WEBLATE
    weblateApiUrl: &weblateApiUrl weblate

    #GLITCHTIP
    glitchtipUrl: &glitchtipUrl glitchtip

    api:
    name: *apiUrl
    replicaCount: 1
    image:
        repository: rg.fr-par.scw.cloud/ulep/api-prod
        tag: "1.0.3528"
        pullPolicy: IfNotPresent
    initImage:
        repository: rg.fr-par.scw.cloud/ulep/api-init
        tag: "1.0.3528"
        pullPolicy: IfNotPresent
    env:
        adminUrl: *adminUrl
        chatUrl: *chatUrl
        appUrl: *webappUrl
        logLevel: debug
        defaultTranslationLanguage: en
        keycloakRealm: etandem
        keycloakAdmin: admin
        keycloakClientId: api
        keycloakClientSecret: *keycloakClientSecret
        keycloakAdminRoleName: admin
        minioUrl: https://minio-api.ulep.thestaging.io
        minioAccessKey: *minioAccessKey
        minioSecretKey: *minioSecretKey
        i18nReloadInterval: "3600000"
        i18nMinioUrl: https://minio-api.ulep.thestaging.io/i18n
        i18nDebug: true
        emailsAssetsBucket: assets
        notificationAssetsBucket: assets
        emailsTranslationsComponent: emails
        emailsAssetsPublicEndpoint: *minioUrl
        notificationAssetsPublicEndpoint: *minioUrl
        appLinkAppleStore: https://www.apple.com/fr/app-store/etandem
        appLinkPlayStore: https://play.google.com/store/apps/etandem
        smtpDisableBootVerification: false
        smtpHost: mailcatcher
        smtpPort: 1025
        smtpSecure: false
        smtpIgnoreTLS: true
        smtpSender: contact@ulep.fr
        firebaseProjectId: *firebaseProjectId
        firebasePrivateKey: *firebasePrivateKey
        firebaseClientEmail: *firebaseClientEmail
        firebaseParallelLimit: 3
        sentryDsn: https://70f6871957074455870c9f1d0ab2ed24@glitchtip.ulep.thestaging.io/4
        cancelTresholdInMin: 15
        signedUrlExpirationInSeconds: 3600
        weblateApiUrl: *weblateApiUrl
    autoscaling:
        enabled: false
        minReplicas: 1
        maxReplicas: 100
        targetCPUUtilizationPercentage: 80
        # targetMemoryUtilizationPercentage: 80
    service:
        type: ClusterIP
        port: 80
    probes:
        readiness:
        initialDelaySeconds: 0
        periodSeconds: 10
        failureThreshold: 6
        liveness:
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 5
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: *apiUrl
            paths: [/]
        tls:
        - hosts:
            - *apiUrl

    auth:
    name: *authUrl
    replicaCount: 1
    image:
        repository: "quay.io/keycloak/keycloak"
        tag: "26.0"
        pullPolicy: IfNotPresent
    initImage:
        repository: "rg.fr-par.scw.cloud/ulep/auth-prod"
        tag: "1.0.3528"
    env:
        keycloakAdmin: admin
        keycloakAdminPassword: *keycloakAdminPassword
        kcDB: postgres
        kcDBSchema: keycloak
        proxyAddressForwarding: true
        logLevel: warn
    autoscaling:
        enabled: false
        minReplicas: 1
        maxReplicas: 100
        targetCPUUtilizationPercentage: 80
    service:
        type: ClusterIP
        port: 80
    probes:
        startup:
        initialDelaySeconds: 10
        periodSeconds: 10
        failureThreshold: 12
        readiness:
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 10
        liveness:
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 5
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: *authUrl
            paths: [/]
        tls:
        - hosts:
            - *authUrl

    # Full configuration: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
    postgresql:
    primary:
        initdb:
        scriptsConfigMap: ulep-init-database
        persistence:
        size: 8Gi
    global:
        postgresql:
        auth:
            username: "ulep"
            password: "password"
            database: "ulep"
        redis:
        password: password

    mongodb:
    image:
        debug: true
        pullPolicy: Always
    architecture: replicaset
    replicaCount: 1
    persistence:
        size: 8Gi
    auth:
        rootUser: "root"
        rootPassword: "password"
        usernames: ["ulep"]
        passwords: ["password"]
        databases: ["ulep"]
        replicaSetKey: KTGovXollW
    initdbScriptsConfigMap: ulep-mongo-postinstall-configmap

    redis:
    pullPolicy: IfNotPresent
    master:
        count: 1
    replica:
        replicaCount: 2
    persistence:
        size: 8Gi
    auth:
        enabled: false
    sentinel:
        masterService:
        enabled: false

    minio:
    name: *minioUrl
    global:
        storageClass: scw-bssd
        storageClassName: scw-bssd
    image:
        tag: 2024.5.10-debian-12-r2
        debug: yes
    clientImage:
        tag: 2024.5.10-debian-12-r2
    auth:
        rootUser: *minioAccessKey
        rootPassword: *minioSecretKey
    persistence:
        size: 10Gi
        storageClassName: scw-bssd
        storageClass: scw-bssd
    # Distributed  mode is recommended for PROD
    mode: distributed
    statefulset:
        replicaCount: 2
        drivesPerNode: 2
    ingress:
        enabled: true
        ingressClassName: *ingressName
        hostname: minio.ulep.thestaging.io
        path: /
        pathType: Prefix
        servicePort: 9001
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        extraTls:
        - hosts:
            - minio.ulep.thestaging.io
            secretName: minio-tls
    apiIngress:
        enabled: true
        ingressClassName: *ingressName
        hostname: minio-api.ulep.thestaging.io
        path: /
        pathType: Prefix
        servicePort: 9000
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        extraTls:
        - hosts:
            - minio-api.ulep.thestaging.io
            secretName: minio-api-tls
    #defaultBuckets: "i18n,assets,objective:private,images:private"

    admin:
    name: *adminUrl
    replicaCount: 1
    image:
        repository: "rg.fr-par.scw.cloud/ulep/admin-prod"
        tag: "1.0.3528"
        pullPolicy: IfNotPresent
    env:
        keycloakClientSecret: *keycloakClientSecret
        sentryDsn: https://11fe01856d4343feabbc1fc89bf5e1a8@glitchtip.ulep.thestaging.io/1
    autoscaling:
        enabled: false
        minReplicas: 1
        maxReplicas: 100
        targetCPUUtilizationPercentage: 80
        # targetMemoryUtilizationPercentage: 80
    service:
        type: ClusterIP
        port: 80
    probes:
        startup:
        initialDelaySeconds: 60
        periodSeconds: 30
        failureThreshold: 5
        readiness:
        initialDelaySeconds: 0
        periodSeconds: 10
        failureThreshold: 3
        liveness:
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 3
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: *adminUrl
            paths: [/]
        tls:
        - hosts:
            - *adminUrl

    chat:
    name: *chatUrl
    replicaCount: 1
    image:
        repository: "rg.fr-par.scw.cloud/ulep/chat-prod"
        tag: "1.0.3528"
        pullPolicy: IfNotPresent
    env:
        mongoInitUser: "root"
        mongoInitPassword: "password"
        mongoInitDatabase: "ulep"
        mongoUser: "ulep"
        mongoPassword: "password"
        mongoDatabase: "ulep"
        mongoLogLevel: "debug"
        logLevel: warn
        sentryDsn: https://dcedcfca51fd41c7802454625b604d30@glitchtip.ulep.thestaging.io/2
    autoscaling:
        enabled: false
        minReplicas: 1
        maxReplicas: 2
        targetCPUUtilizationPercentage: 80
    service:
        type: ClusterIP
        port: 80
        wsPort: 8080
        appPort: 3000
        appPortWs: 5000
    probes:
        readiness:
        initialDelaySeconds: 0
        periodSeconds: 10
        failureThreshold: 6
        liveness:
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 5
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: *chatUrl
            paths: [/]

    webapp:
    name: *webappUrl
    replicaCount: 1
    image:
        repository: nginx
        tag: "1.25.2-alpine"
        pullPolicy: IfNotPresent
    initImage:
        repository: "rg.fr-par.scw.cloud/ulep/webapp"
        tag: "1.0.3528"
        pullPolicy: IfNotPresent
    env:
        viteEnv: staging
        viteSentryDsn: https://114df01b27e242e8b59c5aaef9a1673e@glitchtip.ulep.thestaging.io/3
        viteChatUrl: *chatUrl
        viteSocketChatUrl: *socketChatUrl
    pv:
        storage: 4Gi
        storageClassName: scw-bssd
    autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 100
        targetCPUUtilizationPercentage: 80
        # targetMemoryUtilizationPercentage: 80
    service:
        type: ClusterIP
        port: 80
    probes:
        startup:
        initialDelaySeconds: 30
        periodSeconds: 10
        failureThreshold: 15
        readiness:
        initialDelaySeconds: 0
        periodSeconds: 10
        failureThreshold: 3
        liveness:
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 3
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: *webappUrl
            paths: [/]
        tls:
        - hosts:
            - *webappUrl

    jitsi-meet:
    name: *jitsiUrl
    publicURL: "https://jitsi.ulep.thestaging.io"
    enableAuth: true
    enableGuests: false
    tz: Europe/Paris

    web:
        ingress:
        enabled: true
        className: *ingressName
        annotations:
            kubernetes.io/ingress.class: *ingressName
            kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
            - host: jitsi.ulep.thestaging.io
            paths: ["/"]
        tls:
            - secretName: jitsi-tls
            hosts:
                - jitsi.ulep.thestaging.io
        extraVolumes:
        - name: "jitsi-meet-swp"
            configMap:
            name: "jitsi-meet-swp"
            items:
                - key: "custom-config.js"
                path: "custom-config.js"
                - key: "custom-interface_config.js"
                path: "custom-interface_config.js"
        extraVolumeMounts:
        - name: "jitsi-meet-swp"
            mountPath: "/config/custom-config.js"
            subPath: "custom-config.js"
        - name: "jitsi-meet-swp"
            mountPath: "/config/custom-interface_config.js"
            subPath: "custom-interface_config.js"

    jvb:
        UDPPort: 30378
        useHostPort: true
        publicIPs:
        - 51.159.157.213
        service:
        enabled: true
        type: LoadBalancer
        securityContext:
        allowPrivilegeEscalation: false
        seccompProfile:
            type: "RuntimeDefault"
        readOnlyRootFilesystem: false
        runAsNonRoot: false
        xmpp:
        user: "ulep"
        password: "password"

    prosody:
        persistence:
        enabled: false
        extraEnvs:
        - name: "AUTH_TYPE"
            value: "jwt"
        - name: "JWT_APP_ID"
            value: "api"
        - name: "JWT_APP_SECRET"
            value: *keycloakClientSecret
        annotations:
        reloader.stakater.com/match: "true"
        securityContext:
        allowPrivilegeEscalation: false
        seccompProfile:
            type: "RuntimeDefault"
        readOnlyRootFilesystem: false
        runAsNonRoot: false

    jicofo:
        xmpp:
        user: "ulep"
        password: "password"

    jibri:
        enable: false

    git:
    name: "git"
    replicaCount: 1
    image:
        repository: "rg.fr-par.scw.cloud/ulep/weblate-git-prod"
        tag: "latest" # REQUIRED
        pullPolicy: IfNotPresent
    service:
        type: ClusterIP
        port: 2222
    pv:
        storage: 5Gi # 5Gi recommandé
        volumeMode: Filesystem
        storageClassName: scw-bssd
    resources:
        limits:
        cpu: "3"
        memory: 4000Mi
        requests:
        cpu: "2"
        memory: 3000Mi
    env:
        minioHost: ulep-minio
        minioAccessKey: minio #should be the same as used in project deployment
        minioSecretKey: password #should be the same as used in project deployment
        gitPassword: "password"
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: weblate-git
            paths: [/]

    weblate:
    name: *weblateApiUrl
    replicaCount: 1
    redis:
        nameOverride: "ulep-redis-weblate"
    postgresql:
        nameOverride: "ulep-postgres-weblate"
        auth:
        userName: "ulep"
        postgresPassword: "password"
        database: "weblate"
    image:
        repository: "weblate/weblate"
        tag: "4.18" # REQUIRED
        pullPolicy: IfNotPresent
    env:
        site: weblate
        serverEmail: contact@ulep.fr
        defaultFromEmail: contact@ulep.fr
        emailHost: "mailcatcher" # REQUIRED
        adminEmail: "matthieu.chaulet@thetribe.io" # REQUIRED
        adminPassword: "password"
        emailHostUser: "admin"
        emailHostPassword: "password" # REQUIRED
        emailPort: 1025 # REQUIRED
        allowedHost: "*" # OPTIONNEL
    pv:
        storage: 5Gi # 5Gi recommandé
        volumeMode: Filesystem
        storageClassName: scw-bssd
    autoscaling:
        enabled: false
        minReplicas: 1
        maxReplicas: 100
        targetCPUUtilizationPercentage: 80
        # targetMemoryUtilizationPercentage: 80
    service:
        type: ClusterIP
        port: 80
    resources:
        limits:
        cpu: "3"
        memory: 4000Mi
        requests:
        cpu: "2"
        memory: 3000Mi
    ingress:
        enabled: true
        className: *ingressName
        annotations:
        kubernetes.io/ingress.class: *ingressName
        kubernetes.io/tls-acme: "true"
        cert-manager.io/cluster-issuer: letsencrypt
        hosts:
        - host: *weblateApiUrl
            paths: [/]

    glitchtip:
    name: *glitchtipUrl
    redis:
        nameOverride: "ulep-redis-glitchtip"
        master:
        count: 1
        replica:
        replicaCount: 2
        persistence:
        size: 8Gi
        sentinel:
        masterService:
            enabled: false
    postgresql:
        nameOverride: "ulep-postgres-glitchtip"
        fullnameOverride: "ulep-postgres-glitchtip"
        enabled: true
        auth:
        postgresPassword: change_this
        primary:
        persistence:
            size: 10Gi

    image:
        repository: glitchtip/glitchtip
        tag: v3.4.4
        pullPolicy: Always
    env:
        normal:
        GLITCHTIP_DOMAIN: https://glitchtip.ulep.thestaging.io
        EMAIL_URL: smtp://mailcatcher:1025
        DEFAULT_FROM_EMAIL: info@example.com
        ENABLE_USER_REGISTRATION: "True"
        secret:
        SECRET_KEY: "ThisMustBeChanged!" # run openssl rand -hex 32
    web:
        ingress:
        enabled: true
        className: *ingressName
        annotations:
            kubernetes.io/ingress.class: *ingressName
        hosts:
            - host: *domain
            paths:
                - path: /
                pathType: Prefix

    serviceAccount:
    # Specifies whether a service account should be created
    create: true
    # Annotations to add to the service account
    annotations: {}
    # The name of the service account to use.
    # If not set and create is true, a name is generated using the fullname template
    name: ""

    imagePullSecrets:
    - name: "registrypullsecret"

    nameOverride: ""
    fullnameOverride: ""

    podAnnotations: {}

    podSecurityContext: {}
    # fsGroup: 2000

    securityContext: {}
    # capabilities:
    #   drop:
    #   - ALL
    # readOnlyRootFilesystem: true
    # runAsNonRoot: true
    # runAsUser: 1000

    resources: {}

    nodeSelector: {}

    tolerations:
    - key: "node.kubernetes.io/memory-pressure"
        operator: "Exists"
        effect: "NoSchedule"

    affinity: {}

    reloader:
    reloader:
        deployment:
        resources:
            limits:
            cpu: 500m
            memory: 256Mi
            requests:
            cpu: 10m
            memory: 128Mi
   ```

2. Appliquez la mise à jour :

```bash
helm upgrade <nom-release-ulep> <chart-ulep> -f values.yaml -n <namespace>
```

### 4. Restauration des données

Une fois le déploiement mis à jour, restaurez les données précédemment sauvegardées.

#### Restauration pour Weblate

1. Connectez-vous au pod ulep :
   ```bash
   kubectl exec -it <pod-ulep> -- /bin/bash
   ```
2. Restaurez la base de données :
   ```bash
   psql -h <host-db> -U <user-db> -d <nom-db> < /backup/weblate_backup.sql
   ```
3. Restaurez les fichiers statiques :
   ```bash
   tar -xzvf /backup/weblate_static_files.tar.gz -C /app/data
   ```

#### Restauration pour Glitchtip

1. Restaurez la base de données :
   ```bash
   psql -h <host-db> -U <user-db> -d <nom-db> < /backup/glitchtip_backup.sql
   ```

### 5. Envoi des traductions dans Weblate :

- Cloner le dépot (Le mot de passe est configuré dans helm):

```bash
git clone --branch develop ssh://git@weblate-git.ulep.thestaging.io:2222/srv/git/locales.git
```

- Faites les modifications sur les traductions
- Faire un push

```bash
git add . ; git commit -a -m "pouet" ; git push
```

- Mettre a jour le weblate en cliquant sur "Mettre à jour" dans l'UI de weblate.
