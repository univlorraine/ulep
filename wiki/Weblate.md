# Utiliser Weblate ( Service de traduction )

## <u>Administration</u>

L'administrateur pourra créer des projets et inviter des traducteurs à collaborer.

### <u>Créer un projet</u>

Pour créer un projet connectez vous avec le compte admin que vous avez configurer dans le fichier `helm/weblate/values.yaml`.

Ensuite, suivez les étapes présentés ci-dessous:

![create_project1](/assets/weblate_create_project1.png)

Complétez le formulaire.

![project2](/assets/weblate_create_project2.png)

Vous retrouverez le projet dans l'onglet projet/parcourir tous les projets.
![project3](/assets/weblate_create_project3.png)


### <u>Ajouter un utilisateur au projet</u>

Depuis la page du projet, cliquez sur gérer/utilisateurs.

![create_user1](/assets/weblate_create_user1.png)

Puis Weblate vous offre deux méthodes, soit l'ajout par nom d'utilisateur si le compte existe déjà, soit une invitation par mail pour un nouvel utilisateur.

L'utilisateur recevra alors un mail avec un lien permettant de créer son compte.

### <u>Créer un composant de traduction</u>

Avant tout il faudra copier le dépôt github suivant: [https://github.com/thetribeio/locales_ulep](https://github.com/thetribeio/locales_ulep)

Pour cela vous pouvez soit utiliser un `fork` soit cloner et envoyer le dépôt sur votre gestionnaire de version (github ou gitlab de préférence).

Pour finir la configurer le dépôt, il faut ensuite aller dans les paramètres de weblate (en cliquant sur ![settings](/assets/weblate_settings.png) en haut a droite) et se rendre sur l'onglet *Clés SSH*

Copiez la clée public RSA et ajoutez la en clée de déploiement sur le github ou gitlab dupliqué précédemment.

![github_key](/assets/github_key.png)
*Exemple github*

Ensuite, depuis l'écran de projet, cliquer sur le bouton "Ajouter un nouveau composant de traduction".

Remplissez les champs suivants:

- Nom du composant, ex: Traduction
- Langue source: Français
- Système de contrôle de version: Git (pour github ou gitlab)
- Dépôt du code source: lien SSH github ou gitlab (sous la forme: `git@github.com:<username>/ulep-traduction.git`)

Puis cliquez sur poursuivre.

Après un court chargement Weblate proposera de sélectionner un mode. Choisissez `Format de fichier Fichier JSON à structure imbriquée, Motif de fichier locales/*/translation.json` puis *Poursuivre*.

Dans l'écran suivant, ne modifiez que le paramètre *URL pour l'envoi du dépôt* avec le lien SSH github ou gitlab (sous la forme: `git@github.com:<username>/ulep-traduction.git`)

**Félicitation** vous avez lié Weblate avec la liste des mots à traduire pour l'application Ulep !

Vous voyez alors une suite de paramètre optionnel à configurer si vous le souhaitez pour faciliter la traduction.

En passant à la suite, vous arriverez sur le composant et trouverez les langues préinstallées et traduites.

### <u>Ajouter une langue</u>

Vous avez la possibilité de rajouter des langues depuis le composant créer.

![langue1](/assets/weblate_langue1.png)

Pour ajouter un langue, cliquez sur *Démarrer une nouvelle traduction* et sélectionnez les nouvelles langues à rajouter.

Cette action vas générer une nouvelle ligne de langue non traduite avec tous les mots de la langue principale (Français)

### <u>Traduire une langue</u>

Depuis l'interface du composant de traduction cliquez sur une langue.

Vous trouverez alors des statistiques concernant les mots et phrases restantes à traduire.

![langue2](/assets/weblate_langue2.png)

Vous pourrez alors cliquez sur traduire pour commencer une traduction objet par objet avec la possibilité de faire des suggestions de traduction avec le bouton suggérer. Une traduction suggérée devras alors être valider dans un deuxième temps.

### <u>Valider les ajouts de langues et de traductions</u>

Lorsque que vous voulez déployer une nouvelle version de vos traductions, il faut se rendre sur *Gérer* puis *Maintenance du dépôt* depuis le projet.

![deploy1](/assets/weblate_deploy1.png)

Vous y trouverez les actions git habituelles, commit et push.
Effectuez alors ces 2 actions dans l'ordre et les modifications seront alors visible sur l'application.

Note: si vous n'avez pas donné l'accès en écriture à votre dépot git, vous ne pourrez pas pousser vos modifications depuis l'IHM weblate.

Dans ce cas, vous pouvez alors manuellement merger les changes depuis le dépot de votre weblate vers votre dépot git
```sh
# Cette URL est visible sur la page "Maintenance du dépot" de votre composant dans l'IHM weblate
git remote add weblate <depot_weblate/<projet>/<composant>/

git remote update weblate

git checkout <branche_git_sur_laquelle_est_basée_weblate>

git merge weblate
```

# Troubleshooting

Si vous rencontrez des problèmes avec la traduction d'une langue, cela peut venir du code associé au langage détecté par Weblate.
Pour cela, référez vous à la page [Trouver et changer le code d'une langue](Weblate-‐-Trouver-et-changer-le-code-d'une-langue)