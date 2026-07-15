# Cloisonnement du matching par type de profil

Cette page décrit l'option **« Matching entre personnel et étudiant »**, qui permet à chaque établissement de choisir si l'algorithme de matching peut apparier des **étudiants** avec des **personnels**, ou s'il doit rester **cloisonné** par type de profil.

## Comportement par défaut

**L'option est activée par défaut : le matching est ouvert.**

Un profil peut donc être apparié indépendamment de son type (étudiant ↔ étudiant, personnel ↔ personnel, mais aussi étudiant ↔ personnel). C'est le comportement historique de l'application ; toute instance existante (par ex. l'Université de Lorraine) conserve ce fonctionnement sans aucune action.

En base de données, la colonne correspondante possède la valeur par défaut `true`, appliquée automatiquement aux données déjà en place lors de la migration.

## Ce que fait l'option

Le type de profil d'un utilisateur est déterminé par son rôle, qui vaut soit **`STUDENT`** (étudiant), soit **`STAFF`** (personnel).

| Option en BO | Comportement de l'algorithme |
| --- | --- |
| **Activée** (défaut) | Matching ouvert : les profils sont appariés sans distinction de type. |
| **Désactivée** | Cloisonnement strict : un étudiant ne reçoit que des suggestions d'étudiants, un personnel ne reçoit que des suggestions de personnels. |

Le paramètre s'applique **en temps réel** à tous les nouveaux calculs de matching : il n'est pas nécessaire de relancer un déploiement. Les tandems déjà existants ne sont pas remis en cause ; seul le calcul des nouvelles suggestions et des nouveaux appariements est affecté.

## Configurer l'option dans le Back-office

1. Se connecter au Back-office.
2. Ouvrir l'onglet **Configuration**.
3. Cliquer sur **Modifier**.
4. Activer ou désactiver l'interrupteur **« Autoriser le matching entre le personnel et les étudiants »**.
5. Enregistrer.

La page de consultation de la Configuration rappelle l'état courant :
- **Activé (matching ouvert entre personnel et étudiants)**
- **Désactivé (cloisonnement strict par type de profil)**

## Indépendance entre instances

Chaque instance (par ex. Nantes, Lorraine) possède sa propre base de données et donc son propre paramétrage. Modifier l'option sur une instance n'a **aucun effet** sur les autres : il n'y a pas de code spécifique par université, uniquement une valeur de configuration par instance.

## Cas particulier : tandems pré-arrangés

Lorsqu'un utilisateur a explicitement désigné son partenaire (tandem pré-arrangé, via l'adresse e-mail du partenaire souhaité), cet appariement **n'est pas filtré** par l'option. Il s'agit d'un choix volontaire de l'utilisateur, et non d'une suggestion produite par l'algorithme ; le cloisonnement ne concerne que les suggestions automatiques.

## Détails techniques

- **Stockage** : champ `allow_staff_student_matching` (booléen, défaut `true`) sur la table `Instance` — le singleton de configuration de l'instance.
- **Application** : la contrainte est vérifiée dans le service de scoring du matching (`MatchScorer`), traversé par les deux flux :
  - la génération automatique des tandems (batch) ;
  - les suggestions de partenaires calculées pour un utilisateur.
- Quand l'option est désactivée et que les deux profils ont un rôle différent, la paire est écartée avant scoring.
- La valeur par défaut `true` est présente à tous les niveaux (colonne en base, paramètre du service, DTO), ce qui garantit qu'une instance qui n'a jamais touché à ce réglage reste en matching ouvert.
