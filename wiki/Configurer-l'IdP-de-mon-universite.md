# Configurer l'IdP de mon université

Pour effectuer les instructions suivantes, connectez vous à la console d'administration de Keycloak et sélectionnez le realm `etandem`.

## Intégration d'un l'IdP via le protocol SAML

Pré-requis: téléchargez les métadonnées de l'IdP au format SAML. Celles-ci sont généralement disponible sur un endpoint de votre IdP.

1. Cliquez sur "Identity providers" dans le menu de gauche
2. Sélectionnez le protocole `SAML v2.0`
<img width="1384" alt="idp-1" src="https://github.com/thetribeio/etandem/assets/14289151/1f83d6c7-3005-4488-a62d-e86bc2319ed4">

3. Définissez par lequel vous souhaitez identifier l'IdP dans le champ `Alias`
4. Mettre `Off` pour le champ `Use entity descriptor`
5. Importer le fichier de métadonnées de l'IdP que vous avez téléchargé plus tôt via le champ `Import config from file` (qui apparait après avoir désactivé le champ `Use entity descriptor`.
<img width="1384" alt="idp-2" src="https://github.com/thetribeio/etandem/assets/14289151/9b5dd767-4ed8-41f3-9eae-fc64a277f0b7">

6. Cliquez sur `Add` en bas de page pour ajouter l'IdP.

Il est ensuite nécessaire d'intégrer les métadonnées du Service Provider Keycloak dans votre IdP. Les métadonnées sont exposées via un endpoint visible au niveau du champ `Endpoints` de la page de l'IdP.
<img width="1376" alt="idp-3" src="https://github.com/thetribeio/etandem/assets/14289151/5cbb9d8f-e238-4978-83d3-3db4af82327f">

### Encryption des échanges avec l'IdP

Si vous souhaitez avoir des échanges signés entre le SP (Keycloak) et l'IdP, dans la configuration de l'IdP:
1. Activer l'option `Want AuthnRequests signed`, vous pouvez laisser les valeurs des options par défaut 
2. Activer l'option `Want Assertions encrypted`.

Un certificat sera alors ajouté aux métadonnées du SP (de Keycloak).

### Spécificités UL

A noter que pour se connecter à l'IdP de test d'UL, les modifications suivantes ont du être effectuées:
1. Définir le champ `NameID policy format` sur `Transient`
2. Définir le champ `Principal type` sur `Attribute [Name]`
3. Définir le champ `Principal attribute` sur `urn:oid:0.9.2342.19200300.100.1.3`.

Les points 2. et 3. peuvent être différents suivant la configuration de l'IdP:
- `Principal type`: indique si `Principal attribute` fait référence à un `Name` ou un `FriendlyName` dans la réponse SAML
- `Principal attribute`: la valeur du `Name` ou `FriendlyName` de l'attribut utilisé comme référence pour un utilisateur dans la réponse SAML. Cela doit faire référence à l'attribut contenant l'adresse email de l'utilisateur.
<img width="1377" alt="idp-3 5" src="https://github.com/thetribeio/etandem/assets/14289151/70977777-573b-4915-a5c4-9a11c2340853">

4. Sauvegardez les modifications.

### Configuration des champs récupérés via l'IdP

Sur la page de l'IdP, allez dans l'onglet `Mappers` et cliquez sur "Add mapper".

**Il est nécessaire de définir des mappers pour l'email, le prénom, le nom et le login.**

Pour définir un mapper: 
1. `Name`: le nom du mapper.
2. `Sync mode override`: `Import`
3. `Mapper type`: `Attribute Importer`
4. `Attribute Name`: l'identifiant de l'attribut dans la réponse SAML de l'IDP.
5. `Name Format`: Format du nom. Pour UL `ATTRIBUTE_FORMAT_URI`.
6. `Name`: le nom du champ Keycloak à alimenter via l'IdP. Doit être l'un de: `Email`, `FirstName`, `LastName` ou `universityLogin`.
![idp-11](https://github.com/thetribeio/etandem/assets/14289151/477bd236-6cf2-401a-8e64-e168726de37c)

A titre d'exemple, les valeurs suivantes ont été utilisées pour intégrer l'IdP UL de test:
- `Email`: `Attribute Name` à `urn:oid:0.9.2342.19200300.100.1.3`
- `universityLogin`: `Attribute Name` à `urn:oid:0.9.2342.19200300.100.1.1`
- `FirstName`: `Friendly Name` à `givenName`
- `LastName`: `Friendly Name` à `sn`

## Configuration de l'IdP comme mode de connexion par défaut pour le flow `Browser`

Toujours dans le realm `etandem`, cliquez sur le menu `Authentication` dans le menu de gauche.

Créer un nouveau flow:
1. Cliquez sur le flow `Browser`
<img width="1367" alt="idp-4" src="https://github.com/thetribeio/etandem/assets/14289151/f825ea25-caf9-4360-b364-290c09bc3f48">

2. Dupliquez le flow. `Name` suggéré: `browser-flow-cas-idp`.
<img width="1377" alt="idp-5" src="https://github.com/thetribeio/etandem/assets/14289151/eee91fbf-82eb-41d8-84aa-4663aa75a2eb">
<img width="1382" alt="idp-6" src="https://github.com/thetribeio/etandem/assets/14289151/3c690fc8-bf6d-4956-bf34-f34279708424">

3. Vous devriez automatiquement être sur la page de votre flow dupliqué.

Configurer le nouveau flow:
1. Cliquez sur le bouton `Settings` (la petite roue crantée) de l'élément `Identity Provider Redirector`
<img width="1372" alt="idp-7" src="https://github.com/thetribeio/etandem/assets/14289151/cdd63d7f-5a47-4c59-88a3-79b4519eed36">

2. Donnez un `Alias` à votre configuration. 
3. Définissez l'IdP par défaut dans le champ `Default Identity Provider`. **Ce champ doit contenir le nom que vous avez donnez à votre IdP**
4. Sauvegarder la configuration
<img width="1372" alt="idp-8" src="https://github.com/thetribeio/etandem/assets/14289151/580a6043-8d02-497e-be7f-cf98815b7225">

Lier ce flow avec l'authentification navigateur:
1. Cliquez sur le menu d'action en haut à droite de la page du flow
2. Sélectionnez `Bind flow`
<img width="1379" alt="idp-9" src="https://github.com/thetribeio/etandem/assets/14289151/ae964491-6bb6-4de7-a50d-7fcd483e595b">

3. Sélectionnez `Browser flow` dans la liste déroulante
4. Sauvegardez la modification
<img width="1379" alt="idp-10" src="https://github.com/thetribeio/etandem/assets/14289151/42e9585d-6582-411f-92e0-7743654413e0">


### Forcer l'authentification:

Pour éviter les problèmes de sécurités, il faut dans les options de keycloak forcer les utilisateurs à se connecter à chaque fois qu'ils ouvrent le connecteur.

![tuto-authentification](https://github.com/thetribeio/etandem/assets/101122547/57dba427-23ba-4e7d-8bf2-ae700cc4407e)

## Note

Il est nécessaire que le `Standard Flow` soit activé sur le client avec l'ID `api` (cela est normalement effectif avec l'import du realm fourni à la création de Keycloak). Si ce n'est pas le cas, aller dans dans les clients du realm `etandem`, selectionnez `api` puis cochez la case `Standard Flow` pour le paramètre `Authentication flow`.
