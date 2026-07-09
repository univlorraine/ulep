## Qu'est-ce que GlitchTip ?

GlitchTip est une plateforme de suivi des erreurs open-source. Elle est conçue pour collecter, organiser et analyser les erreurs générées par les applications ou sites web

## Installation et Déploiement

1. Créez un nouveau fichier `values.yaml` en vous basant sur le contenu du fichier `values.yaml.tmp`.

2. Modifiez le fichier `values.yaml`.

3. Déployer GlitchTip sur votre cluster Kubernetes:
```sh
helm install glitchtip . -n <namespace>
```

## Ressources

- [documentation](https://glitchtip.com/documentation)

