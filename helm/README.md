# Avant de déployer les clusters

## Choisir un nom de domaine

Pensez à choisir les noms de domaines utilisées et à configurer les redirections.

## Configurer le HTTPS

### Déployer nginx-ingress-controller

Cette installation permettra de gérer la redirection des requête vers les bons services (reverse proxy nginx)

`helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx && \
helm repo update && \
helm install ingress-nginx ingress-nginx/ingress-nginx`

### Déployer cert-manager

Cert-manager vas simplifier la mise en place des certificats SSL.

`kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml`

### Configurer un Issuer

L'issuer vas permettre de configurer le HTTPS.

Pour le créer, modifier les paramètre notées `# REQUIRED` dans le fichier `issuer.yaml` et déployez le dans le cluster via cette commande: 

`kubectl apply -f issuer.yaml`

## Supprimer ces configurations

`kubectl delete -f issuer.yaml`
`kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml`
`helm uninstall ingress-nginx`
