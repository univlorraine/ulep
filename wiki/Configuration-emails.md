# Configuration emails

## Traductions

Les traductions de texte des emails sont à faire sur weblate.

Voir [la documentation dédiée](Weblate#créer-un-composant-de-traduction) pour ajouter un composant `emails` dans les composants de traduction.

Note: si jamais les textes d'un email ne sont que partiellement remplis dans une langue, l'application ne sera pas en mesure d'envoyer d'emails pour cette langue. Il vaut mieux ne pas avoir de traductions (dans ce cas là, anglais par défaut) que des traductions incomplètes.

## Images

L'hébergement des images utilisées dans les emails doit se fait sur MinIO.

Il est donc important de:
1. Créer et configurer le bucket dans minIO
2. Ajouter les images dans le bucket

Pour cela il faut commencer par se connecter sur la console de MinIO.

### Création du bucket

1. Dans le menu de gauche, cliquez sur "Buckets"
2. Cliquez sur le bouton "Create bucket" en haut à droite
![1](https://github.com/thetribeio/etandem/assets/14289151/20c2403c-2493-41f2-b576-1363ebc2c65a)

3. Renseignez le nom du Bucket. Il n'est pas nécessaire d'activer des features. Le nom du bucket peut être configuré au niveau de l'API, il n'est donc pas obligatoire d'appeler le bucket "assets".
4. Cliquez sur Create Bucket
![2](https://github.com/thetribeio/etandem/assets/14289151/240fd82c-7804-42d0-880a-f31b168382b3)


### Insertion des données

Ajoutez les images requises pour les emails dans le bucket.

Vous pouvez trouver les images dans le dossier [`data/emails/defaultImages` du répertoire](https://github.com/thetribeio/etandem/tree/develop/data/emails/defaultImages)

Les noms des images doivent être respectés.

Voici la correspondance entre nom d'image et leur place dans l'email

![6](https://github.com/thetribeio/etandem/assets/14289151/b2bcc27f-e278-46e7-9a2c-b563f78ce34f)
