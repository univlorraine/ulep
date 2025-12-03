Pour définir une nouvelle instance il faut monter toutes les stacks de l'applications sur un nouveau serveur et une fois que l'url de l'api est définie et publique alors il faut effectuer des changements côté mobile. 

Pour les changements côté mobile : 

Ajouter dans le fichier `src/presentation/page/mobile/InstancePage` un nouvel item dans la liste des instances sous le format suivant 

```
{
        image: ULLogo,
        name: 'Université de Lorraine et ses partenaires',
        apiUrl: import.meta.env.VITE_UL_API_URL,
},
```

Il faut donc ajouter l'image correspondante à l'instance dans le dossier suivant `src/assets/instances/` et l'importer comme le ULLogo.
Il faut aussi ajouter dans le `.env` la variable d'environnement de l'api sous la forme suivante `VITE_??_API_URL`

À partir de ces modifications, normalement l'application va être capable de se connecter à la nouvelle instance lorsque l'utilisateur la séléctionnera