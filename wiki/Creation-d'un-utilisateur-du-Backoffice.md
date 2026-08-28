Les utilisateurs du Back-office sont à créé directement dans Keycloak.
La suite des instructions sont donc à effectuer une fois connecté sur la console d'administration de Keycloak.

# Accéder à la création de compte

1. Sélectionner le realm `etandem`
<img width="1375" alt="1" src="https://github.com/thetribeio/etandem/assets/14289151/7415ac39-b6ff-4d1b-accc-9709dbe8ff4c">

2. Aller dans le menu "Users"
<img width="1382" alt="2" src="https://github.com/thetribeio/etandem/assets/14289151/6d6c61ba-30d4-462d-aab6-20060339a046">

3. Cliquer sur "Add user" pour créer un nouvel utilisateur
<img width="1378" alt="3" src="https://github.com/thetribeio/etandem/assets/14289151/b0c69528-d4b5-4f72-8777-f3e263acd89c">

# Création de l'utilisateur

<img width="1378" alt="4" src="https://github.com/thetribeio/etandem/assets/14289151/1ef96af9-794c-46c7-a31a-f86559b1023e">

1. Renseignez l'email de l'utilisateur
2. Ajouter l'utilisateur au groupe `Administrator` en cliquant sur le bouton "Join Groups"
3. Cliquez sur "Create"

# Initialisation de l'utilisateur

## Définition du mot de passe

Dans l'onglet "Credentials": 
1. Cliquez sur "Set password"
<img width="1380" alt="5" src="https://github.com/thetribeio/etandem/assets/14289151/85483c87-d710-4b65-bdaf-60e8d8b0c15a">

2. Renseignez un password pour l'utilisateur ainsi que sa confirmation
<img width="1378" alt="6" src="https://github.com/thetribeio/etandem/assets/14289151/72823b92-92f3-40d2-b6dc-e22a5e7d4986">

3. Définir "Temporary" sur `Off`
4. Cliquez sur "Save" et confirmez

## Définition de son université

Si l'utilisateur fait partie de l'université centrale, alors cette étape ne doit pas être réalisée.

Dans le cas d'un utilisateur d'une université partenaire, cette étape est obligatoire.

Dans l'onglet "Attributes"
1. Cliquez sur "Add an attribute"
<img width="1380" alt="7" src="https://github.com/thetribeio/etandem/assets/14289151/81de57ea-95dc-4aff-a6fb-7db9fe4f814f">

2. Remplir le champ "Key" avec `universityId`
<img width="1376" alt="8" src="https://github.com/thetribeio/etandem/assets/14289151/057047ed-478a-46eb-ae61-7b620ca2c81f">

3. Pour la valeur, utilisez l'ID de l'université pour lequel vous voulez créé cet utilisateur. Voir section  [Récupération de l'ID d'une université](###Récupération-de-l'ID-d'une-université).

### Récupération de l'ID d'une université

Cette étape nécessite un compte utilisateur université centrale pour le Back-office.

1. Connectez vous sur le Back-office
2. Allez sur la page "Universités"
3. Cliquez sur l'université dont vous voulez récupérer l'ID dans la liste des universités.

<img width="1379" alt="9" src="https://github.com/thetribeio/etandem/assets/14289151/eda254aa-42ab-4748-ad02-40f141faa7d0">

4. L'ID est visible sous le champ `ID`

<img width="1377" alt="10" src="https://github.com/thetribeio/etandem/assets/14289151/ff37fb6e-34a0-4ad6-9580-d61fd1d55672">

