# Monitoring

## Cluster Kubernetes

Il est recommandé de suivre la santé du cluster, en observant notamment le niveau de consommation du CPU, de la mémoire et les niveaux de remplissages de Persistent Volumes.

Ceci est possible à un niveau très basique avec le [Dashboard Kubernetes](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/).

### Monitoring avancé

De nombreux outils existent pour avoir des données plus précises sur l'état de votre cluster.
Certains outils open sources bénéficient d'un grand usage dans la communauté, parmi lesquels [Prometheus](https://prometheus.io/) et [Grafana](https://grafana.com/).

Si vous souhaitez investir plus de resource sur le monitoring, nous vous conseillons de mettre en place Prometheus, qui vous permettra de mettre en place des alertes en plus de permettre de collecter et visualiser un certain nombres de métriques.

A noter qu'il existe le projet [prometheus-operator](https://prometheus-operator.dev/) permettant de mettre en place ces 2 outils.

### Alertes

Comme mentionné dans le monitoring avancé, il est recommandé de mettre en place des alertes sur la consommation du cluster Kubernetes afin d'être prévenu automatiquement en cas de dépassement des seuils.

## Noeuds et Pods

Il est également conseillé de surveiller la consommation en CPU et mémoire du pool de noeud composant le cluster Kubernetes ainsi que la consommation des pods (notamment les pods relatifs aux applicatifs) pour s'assurer qu'il ne sont pas proche de la rupture et que le scaling est bien configuré.

# Scaling

La configuration du scaling (en français "mise à l'échelle") permet au système d'adapter dynamiquement ses ressources en fonction de la charge.
Il faut néanmoins configurer les seuils d'augmentation et réduction des ressources pour cela.

Note: il est recommandé de faire des tests de montée de charge pour évaluer les seuils pertinents pour le scaling

## Noeuds

Un cluster Kubernetes est composé de noeuds fournissant les ressources du cluster. 

Il est recommandé de permettre un scaling automatique du nombre de noeuds composant le cluster. La façon de le faire dépend néanmoins de comment le cluster est installé sur votre environnement.

## Pods

Pour configurer le scaling des pods, il faut:
- Définir la limite de ressource auxquelles peut accéder un pod (c.f. [doc](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/), ces éléments sont configurables via la clé `resources` des charts Helm)
- Activer l'auto scaling et définir les seuils (c.f. [doc](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)), ces éléments sont configurables via la clé `autoscaling` des charts Helm. Il est généralement conseiller de définir le seuil de montée en mémoire/CPU et de définir le nombre maximum de pod (afin d'éviter une montée en charge non maitrisée)
