# Favicon, manifest et title configurables — design

Date : 2026-07-17
Statut : validé (conversation Claude Code)

## Contexte

Plusieurs instances du site sont déployées sur des infras et domaines différents.
Le favicon, le manifest PWA et le title doivent être personnalisables par instance.
Aujourd'hui, `useFetchConfiguration.ts` (app) modifie `document.title` et le favicon
au runtime à partir de la config API ; le manifest est un fichier statique de `public/`.

Contrainte découverte : le bucket MinIO `assets` est privé, exposé uniquement via des
URLs signées 24h (`temporaryUrl`). Une URL MinIO fixe bakée au build est donc impossible.
Décision : exposer favicon et manifest via des endpoints API proxy à URL stable.

## Décisions

- **Favicon / manifest** : fichiers uploadés depuis le BO (admin), stockés sous nom fixe
  dans le bucket `assets` MinIO, servis par l'API via deux endpoints publics à URL stable.
  `index.html` référence ces URLs via `%VITE_APP_FAVICON%` / `%VITE_APP_MANIFEST%`
  (variables d'environnement définies au build, par instance).
- **Title** : build-time uniquement. `%VITE_APP_TITLE%` figé au build ; pas de champ BO ;
  un changement de title nécessite un redéploiement.
- La mise à jour runtime du favicon et de `document.title` dans `useFetchConfiguration.ts`
  est supprimée.

## App (`app/`)

- `index.html` : conserve `%VITE_APP_TITLE%`, `%VITE_APP_FAVICON%`, `%VITE_APP_MANIFEST%`
  (déjà en place). Les URLs pointeront vers les endpoints API au déploiement.
- `useFetchConfiguration.ts` : supprimer le bloc favicon (création/mise à jour du
  `<link rel*='icon'>`) et le bloc `document.title`. Conserver fonts et variables CSS.
- `Confirguration.ts` : retirer `faviconURL` (plus de consommateur côté app).
- `public/manifest.json` : conservé comme valeur par défaut du repo, plus la source servie.

## API (`api/`)

- `minio.storage.ts` :
  - constante `MANIFEST_FILENAME = 'manifest.json'` ;
  - méthode `read(bucket, name)` pour streamer un objet (n'existe pas encore).
- `instance.controller.ts` :
  - `GET /instance/favicon` : streame `favicon.ico` du bucket `assets`,
    `Cache-Control: public, max-age=3600`, `Content-Type` adapté, 404 si absent ;
  - `GET /instance/manifest` : idem avec `Content-Type: application/manifest+json` ;
  - `PUT /instance` : champs multipart `faviconFile` et `manifestFile` ajoutés au
    `FileFieldsInterceptor`, traités par deux usecases calqués sur
    `upload-instance-watermark.usecase.ts` (écriture sous nom fixe).
- Aucun champ en base (comme le watermark) ; aucun changement de DTO texte.

## Admin (`admin/`)

- `InstanceForm.tsx` : deux `FileUploader` (favicon : `image/x-icon,image/png` ;
  manifest : `.json,.webmanifest`), sur le modèle du watermark.
- `entities/Instance.ts` : `faviconFile` et `manifestFile` dans `InstanceFormPayload`.
- `pages/instance/edit.tsx` : append des deux fichiers dans le `FormData`.
- Locales `en.json` / `fr.json` : libellés des deux nouveaux champs.

## Comportements et limites acceptés

- Un changement de favicon dans le BO est visible au prochain chargement de page,
  avec une latence de cache navigateur jusqu'à 1h (max-age=3600).
- Le manifest étant servi par l'API (autre origine que l'app), le CORS de l'API doit
  autoriser le domaine de l'app (déjà le cas pour `/instance/config`).
- Si aucun manifest n'a été uploadé, `GET /instance/manifest` renvoie 404 ; le
  navigateur ignore alors le manifest (pas d'erreur bloquante).
- Le title ne change qu'au rebuild.

## Tests

- API : tests des deux usecases d'upload et des deux endpoints de lecture
  (présence, absence → 404, headers de cache/content-type).
- App : vérifier que la config se charge toujours et qu'aucune manipulation
  favicon/title ne subsiste.
- Admin : soumission du formulaire avec les nouveaux fichiers → FormData correct.
