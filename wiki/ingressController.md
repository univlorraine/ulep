# Comment déployer l'ingress controller ? (Traefik)

## <u>Prérequis</u>

- [helm](https://helm.sh/)
- Avoir créé un cluster kubernetes

## <u>Déploiement</u>

**Ajouter traefik dans le repo local:**

`helm repo add traefik https://helm.traefik.io/traefik`

**Mise à jour du repo:**

`helm repo update`

**Intallation de l'ingress controller:**

`helm install traefik traefik/traefik`
