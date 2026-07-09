# Comment déployer le cluster issuer ?

## <u>Installation</u>

Pour le créer, modifier les paramètre notées `# REQUIRED` dans le fichier `helm/issuer.yaml` et déployez le dans le cluster via cette commande: 

`kubectl apply -f issuer.yaml`

## <u>Désinstallation</u>

`kubectl delete -f issuer.yaml`
