# Montée de version 

La montée de version du système se fait à l'aide de helm.

Afin de déployer une nouvelle version du système il faut: 
- Changer la version de l'applicatif que vous voulez faire évoluer dans le fichier de valeur (values.yaml par défaut).
- Réaliser une upgrade du chart Helm avec les nouvelles versions.

Concrètement, les versions sont spécifiés à travers les variables du chart helm `project` suivantes : 
- API : `api.image.tag`
- Backoffice : `admin.image.tag`
- Webapp : `webapp.image.tag`

Une fois ces valeurs changées avec les nouvelles versions que vous souhaitez déployer, il faut lancer l'ugprade via helm.
```sh
# Par exemple si le chart a été installé avec le nom "ulep" et que vous êtes dans le dossier courrant du chart
# helm -n ulep upgrade ulep .

helm -n <namespace> upgrade <nomRelease> <repoChart>
```

**IMPORTANT: helm s'assure de la continuité du service durant la montée de version. De fait, il créé donc des instances des nouveaux éléments demandés avant de supprimer les anciennes instances (s'il n'y a pas eu de problème).** Il faut donc prévoir une augmentation des ressources consommées (~2 fois supérieur) durant cette montée de version.

# Retour en arrière

Vous pouvez faire un retour en arrière vers une ancienne version déployée.

Pour cela, il faut exécuter la commande suivante: 
```sh
helm -n <namespace> rollback <nomRelease> <revision>
```

Pour voir les différentes révisions existantes, vous pouvez utiliser la commande `helm history`:
```sh
helm -n <namespace> history <nomRelease>
```

# iOS build requirements

- xcode: 16.4
- @ionic/cli: 7.2.1
- cocoapods: 1.16.2
