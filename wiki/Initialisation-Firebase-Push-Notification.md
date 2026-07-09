## Création d'un projet Firebase

1. Ouvrez votre navigateur et allez sur [Firebase](https://firebase.google.com/).
2. Cliquez sur "Accéder à la console" situé en haut à droite de l'écran d'accueil de Firebase.
![firebase](uploads/77db9bd78095340fd810ac0026a4a8b2/firebase.png)
3. Cliquez sur "Ajouter un projet", puis suivez les instructions pour nommer votre projet et accepter les conditions d'utilisation. Cliquez ensuite sur "Créer un projet".

## Ajout d'une application mobile Android à Firebase

1. Cliquez sur l'icône Android pour ajouter une nouvelle application.
![image](uploads/278b8d6518c3e6c34fdb72588022e864/image.png)
2. Saisissez le nom du package de votre application Android tel qu'il apparaît dans le projet (ex: fr.univlorraine.ulep)
3. Saisissez le surnom de l'app et l'empreinte du certificat SHA-1 si nécessaire puis cliquez sur "Enregistrer l'application".
4. Suivez les instructions pour télécharger le fichier google-services.json et placez-le dans le dossier 'app' du projet Android.

## Ajout d'une application mobile iOS à Firebase

1. Dans votre projet Firebase, cliquez sur ajouter une nouvelle application.
![image](uploads/e2a82d20d464fbefeb469a603a64181e/image.png)
2. Saisissez l'identifiant de votre bundle iOS, le surnom de l'app, et l'ID de l'application App Store puis cliquez sur "Enregistrer l'application".
3. Téléchargez le fichier GoogleService-Info.plist et intégrez-le dans le dossier du projet ios/App/App.
4. Afin de pouvoir envoyer des notifications APNS, il faut créer une clé sur le site du Apple Developper.
![Capture_d_écran_2024-04-17_à_17.08.21](uploads/8ba0f17915844af92606a66a4f21155b/Capture_d_écran_2024-04-17_à_17.08.21.png)
5. Cliquez sur le "Create a key" ( ou sur le + bleu si vous avez déjà des clés ) 
6. Cochez la case "Apple Push Notifications service (APNs)" et donnez un nom à votre clé. Vous allez pouvoir télécharger la clé pour les APNS ( ATTENTION : Cette clé n'est telechargeable qu'une seule fois, donc pensez à bien la stocker )
7. Sur Firebase, dans paramètre des projets ( l'engrenage ) vous devez aller dans la sous catégorie Cloud Messaging et importer votre clé APNS que vous venez de créer.

## Configuration des certificats Apple pour les notifications

Cette étape n'est utile que si vous n'avez pas pu faire les étapes 6 et 7 de l'étape précédente

1. Mettre à jour le/les indentifier.s de l'application sur le Apple Developper et cocher la case Push Notifications.
2. Créer un nouveau certificat ( onglet Certicicates, cliquez sur le + bleu ), "cochez Apple Push Notification service SSL (Sandbox & Production)" puis faites continue
3. Sélectionnez l'identifier correspondant à votre application
4. Il va ensuite falloir créer un CSR avec un MacOs. Pour ce faire vous devez allez sur l'application Keychain. Ensuite dans "Trousseaux d'accès" > "Assistant de Certificat" > "Demander un certificat à une autorité de certificat"
5. Remplissez le champs "Adresse e-mail de l'utilisateur" et "Nom commun". Séléctionez "Enregistrée sur le disque"
6. Uploadez le CSR puis faîtes "continue"
7. Téléchargez le certificat et ajoutez le à votre trousseaux en double cliquant dessus ( MacOs ), ouvrez le trousseaux d'accès, cherchez "Apple Push Services : xx.xxxx.xx" ensuite cliquez droit sur le fichier pour l'exporter en .p12. 
8. Sur Firebase, dans paramètre des projets ( l'engrenage ) vous devez aller dans la sous catégorie Cloud Messaging et importer votre clé P12 que vous venez de créer dans certificat de production.

## Configuration du service client pour l'envoi de notifications push

L'envoi de notifications push à travers Firebase nécessite l'utilisation de Firebase Cloud Messaging (FCM). Pour permettre au backend d'envoyer des notifications, vous devez suivre ces étapes :

1. Dans la console Firebase, naviguez vers "Paramètres du projet" en cliquant sur l'icône de l'engrenage située à côté de "Project Overview".
2. Allez à l'onglet "Comptes de service".
3. Cliquez sur "Générer une nouvelle clé privée", téléchargez cette clé, car elle sera utilisée pour les variables d'environnement dans l'api.
4. Cliquez sur X comptes de service afin de gérer les permissions du compte service (notez bien le nom du Compte de service Firebase, dans l'image c'est firebase-adminsdk-y69xr... ) 
![Capture_d_écran_2024-04-17_à_10.25.40](uploads/16836079262afde9cf43edbbbb3ab885/Capture_d_écran_2024-04-17_à_10.25.40.png)
5. Après avoir cliqué sur les comptes services vous serez redirigez vers IAM de la google cloud console avez la liste des comptes de services, cliquez sur le crayon de la ligne qui correspond au compte service firebase
![image](uploads/cac2e600edf37e1cacd0f4497f6e2b7e/image.png)
6. Ajoutez le rôle "Administrateur Firebase Cloud Messaging"

## Configuration de l'API

Pour que l'API fonctionne correctement avec l'envoie des push notifications il faut ajouter trois variables d'environnements `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY` et `FIREBASE_CLIENT_EMAIL`. On retrouve les valeurs de ces variables dans le fichier qui a été téléchargé à l'étape précédente ( la clé privée du compte service firebase ). 

Voici un tableau qui associe la valeur de la clé privée avec la variable d'environnement
| Variable d'environnement | Clé privée |
| ------ | ------ |
|   FIREBASE_PROJECT_ID     |   project_id     |
|   FIREBASE_PRIVATE_KEY   |    private_key    |
|  FIREBASE_CLIENT_EMAIL   |    client_email    |

ATTENTION : Concernant la clé privée il faut également mettre les headers `-------BEGIN PRIVATE KEY-----\n- ` et le footer `\n-----END PRIVATE KEY-----\n`

Il existe également une variable d'environnement `FIREBASE_PARALLEL_LIMIT` qui permet de gérer le nombre d'envoie simultanée de notifications, la valeur par défaut est 3