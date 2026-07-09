# Mailjet

Si vous n'avez pas de serveur smtp à disposition, nous vous proposons d'utiliser le service Mailjet permettant de créer des templates de mails ainsi que d'utiliser son propre nom de domaine.

## <u>Mise en place de Mailjet</u>

### <u>Création du compte</u>

Tout d'abord créez votre compte sur [Mailjet](https://www.mailjet.com/)

### <u>Ajout d'une clée api</u>

Après avoir créer votre compte, cliquez sur votre profil puis préférences du compte.

Depuis cette interface cliquez sur Gestion des clés API.

![Api](/assets/mailjet_api.png)

Créez alors une nouvelle clé, et conservez en sécurité la clé privée.

La clé d'api publique servira de nom d'utilisateur pour le `values.yaml` du composant weblate et la clé privée (ou secrète) servira de mot de passe.

### <u>Configurer les adresses mail et le nom de domaine</u>

Rendez vous sur la page des préférences du compte et cliquez sur *Ajout d'un domaine ou d'une adresse d'expéditeur*.

Cliquez sur *Ajouter un domaine* et ajoutez alors les informations que vous souhaitez.

Ensuite, plus bas dans la page, cliquez sur *Ajouter une autre adresse d'envoi*. Il définira l'adresse utilisé par weblate lors des demandent de connexions par exemple.

Passez maintenant à l'onglet *Authentification SPF/DKIM*

![Domain](/assets/mailjet_domain.png)

Vous retrouverez normalement le nom de domaine que vous avez ajouté précédemment.

Cliquez alors sur l'engrenage à côté du nom de domaine pour effectuer la configuration de l'authentification SPF/DKIM.

Vous arrivez alors sur une page qui vous indique comment configurer vos enregistrements DNS.

La validation du SPF et DKIM peut prendre plusieurs heure.

### <u>Félicitation</u>

Vous avez configurer proprement votre instance mailjet !