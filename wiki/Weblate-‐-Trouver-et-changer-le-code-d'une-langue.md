Weblate détecte la langue du fichier de traduction. Il peut arriver que le langage détecté ait un code différent du nom du fichier.
**Cela peut poser problème si le code du langage detecté est un code régional / précis (i.e. un code qui contient un tiret ou underscore).**

C'est par exemple le cas du Chinois simplifié, pour lequel le code du langage detecté est `zh_Hans` même si le fichier s'appelle `zh`.

# Détecter le code d'une langue

Afin de vérifier si un problème de traduction vient d'un mauvais code de langage il est nécessaire de trouver le code du langage dans Weblate. 
Pour cela: 
1. Dans l'interface Weblate, cliquez sur `Projects` dans le menu du haut. Sélectionnez votre projet.
2. Allez dans l'onglet `Languages` et cliquez sur le langage que vous voulez vérifier.
![4](https://github.com/thetribeio/etandem/assets/14289151/1a9eb149-2bdf-41fa-9253-c51cce7d9e30)
3. Regarder le code dans l'URL.
![5](https://github.com/thetribeio/etandem/assets/14289151/aa3a064b-4ff7-4934-8c1b-6296d22a10b9)

# Changer le code d'une langue

Il est alors nécessaire de changer le code associé à la langue dans Weblate pour que la traduction soit correctement récupérée par les applications.

1. Dans l'interface Weblate, cliquez sur `Languages` dans le menu du haut
2. Cliquez ensuite sur `Browse all languages`
![1](https://github.com/thetribeio/etandem/assets/14289151/c5b898e3-a3e8-4a20-8ab5-0460bc1655e0)
3. Une fois la ligne du langage trouvé, cliquez dessus
![2](https://github.com/thetribeio/etandem/assets/14289151/def7226d-3da7-4ac7-b107-bdfde4124f2d)
4. Dans l'onglet `Information`, cliquez sur `Edit` dans la ligne du code de langage
![3](https://github.com/thetribeio/etandem/assets/14289151/52d6e3d7-cfc7-4ac0-b119-c3d298e6b015)
5. Modifier la valeur pour correspondre au code du langage dans l'application. Se référer aux codes dans la base de données pour cela. Sauvegarder