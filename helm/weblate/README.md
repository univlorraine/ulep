# Déployer le cluster de traduction

## Remplir le values.yaml

Chaque paramètres avec le tag `# REQUIRED` doit être rempli, il est souvent accompagné d'exemple.

## Lancer le cluster

Depuis un terminal, depuis le dossier `helm/weblate` lancer la commande: 

`helm install <nom du déploiement> . --create-namespace -n <nom du namespace>`

## Désinstaller le cluster

`helm uninstall <nom du déploiement> -n <nom du namespace>`

Cette action ne supprime pas les volumes donc les données ne seront pas supprimées.

Pour supprimer les données avec, il est possible de faire ces commandes: 

`kubectl get pvc -n <nom du namespace>`

et de choisir dans la liste les volumes à supprimer avec: 

`kubectl delete <nom du volume> -n <nom du namespace>`