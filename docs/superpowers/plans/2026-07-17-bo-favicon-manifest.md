# Favicon & manifest BO — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Favicon et manifest PWA uploadables depuis le BO, servis par l'API via des URLs stables référencées au build dans `index.html` ; suppression de la mise à jour runtime du favicon/title côté app.

**Architecture:** Les fichiers vivent sous nom fixe dans le bucket MinIO privé `assets` (comme le watermark). Deux endpoints publics `GET /instance/favicon` et `GET /instance/manifest` streament l'objet avec headers de cache. Upload via `PUT /instance` multipart. Title = `%VITE_APP_TITLE%` build-time uniquement.

**Tech Stack:** NestJS + @aws-sdk/client-s3 (api), React/Ionic + Vite (app), react-admin (admin).

## Global Constraints

- Spec : `docs/superpowers/specs/2026-07-17-bo-favicon-manifest-design.md`
- Suivre le pattern watermark existant (usecase → controller → admin FileUploader).
- Header de licence CeCILL en tête de tout nouveau fichier (copier depuis un fichier voisin).
- `Cache-Control: public, max-age=3600` sur les deux endpoints de lecture ; 404 (`RessourceDoesNotExist`) si l'objet est absent.
- Pas de champ en base ; pas de champ `title` BO.

---

### Task 1: Usecases d'upload favicon & manifest (api)

**Files:**
- Modify: `api/src/providers/storage/minio.storage.ts` (ajouter `export const MANIFEST_FILENAME = 'manifest.json';` après la ligne 62)
- Create: `api/src/core/usecases/media/upload-instance-favicon.usecase.ts`
- Create: `api/src/core/usecases/media/upload-instance-manifest.usecase.ts`
- Modify: `api/src/core/core.module.ts` (imports ~l.243, tableau usecases ~l.332)

**Interfaces:**
- Produces: `UploadInstanceFaviconUsecase.execute({ file })`, `UploadInstanceManifestUsecase.execute({ file })` — mêmes signatures que `UploadInstanceWatermarkUsecase`.

- [ ] **Step 1:** Créer les deux usecases, copie de `upload-instance-watermark.usecase.ts` :

```ts
// upload-instance-favicon.usecase.ts (avec header CeCILL)
export class UploadInstanceFaviconCommand { file: File; }

@Injectable()
export class UploadInstanceFaviconUsecase {
  constructor(@Inject(STORAGE_INTERFACE) private readonly storage: StorageInterface) {}
  async execute(command: UploadInstanceFaviconCommand): Promise<void> {
    await this.storage.write(ASSETS_BUCKET, FAVICON_FILEMANE, command.file);
  }
}
// upload-instance-manifest.usecase.ts : idem avec MANIFEST_FILENAME
```

- [ ] **Step 2:** Enregistrer les deux usecases dans `core.module.ts` (import + tableau, à côté de `UploadInstanceWatermarkUsecase`).
- [ ] **Step 3:** `pnpm build` (ou tsc) dans `api/` → compile sans erreur.

### Task 2: Endpoints GET /instance/favicon et /instance/manifest (api)

**Files:**
- Modify: `api/src/api/controllers/instance.controller.ts`

**Interfaces:**
- Consumes: `StorageInterface.read/fileExists`, constantes `ASSETS_BUCKET`, `FAVICON_FILEMANE`, `MANIFEST_FILENAME`.
- Produces: `GET /instance/favicon` (image), `GET /instance/manifest` (`application/manifest+json`), 404 si absent.

- [ ] **Step 1:** Injecter `@Inject(STORAGE_INTERFACE) storage: StorageInterface` dans le contrôleur et ajouter :

```ts
@Get('favicon')
async favicon(@Res() res: Response): Promise<void> {
  await this.streamAsset(res, FAVICON_FILEMANE, 'image/x-icon');
}

@Get('manifest')
async manifest(@Res() res: Response): Promise<void> {
  await this.streamAsset(res, MANIFEST_FILENAME, 'application/manifest+json');
}

private async streamAsset(res: Response, filename: string, contentType: string): Promise<void> {
  if (!(await this.storage.fileExists(ASSETS_BUCKET, filename))) {
    throw new RessourceDoesNotExist();
  }
  const stream = await this.storage.read(ASSETS_BUCKET, filename);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  stream.pipe(res);
}
```

Attention à l'ordre des routes : `@Get('favicon')`/`@Get('manifest')` sont des segments littéraux, pas de conflit avec `locales/:lng/translation`.

- [ ] **Step 2:** Ajouter `faviconFile` et `manifestFile` au `FileFieldsInterceptor` du `PUT /instance` + appels aux usecases (même motif que watermark).
- [ ] **Step 3:** Build + test manuel : upload puis `curl -i localhost:<port>/instance/favicon` → 200, bons headers ; objet absent → 404.

### Task 3: Nettoyage runtime app

**Files:**
- Modify: `app/src/presentation/hooks/useFetchConfiguration.ts` (supprimer lignes 161-176 : bloc favicon + bloc document.title ; retirer `result.faviconURL` du constructeur Configuration)
- Modify: `app/src/domain/entities/Confirguration.ts` (retirer `faviconURL`)

- [ ] **Step 1:** Supprimer les deux blocs et le paramètre `faviconURL` (vérifier qu'aucun autre consommateur n'existe : `grep -rn faviconURL app/src`).
- [ ] **Step 2:** `pnpm exec tsc --noEmit` (ou build) dans `app/` → OK.

### Task 4: Formulaire admin

**Files:**
- Modify: `admin/src/entities/Instance.ts` (`InstanceFormPayload` : `faviconFile: File | undefined; manifestFile: File | undefined;`)
- Modify: `admin/src/components/form/InstanceForm.tsx` (deux states + deux `FileUploader` à côté du watermark ~l.471 ; injection dans le payload ~l.153)
- Modify: `admin/src/pages/instance/edit.tsx` (append FormData ~l.83)
- Modify: `admin/src/locales/en.json`, `admin/src/locales/fr.json`

- [ ] **Step 1:** `FileUploader` favicon : `accept="image/x-icon,image/png"` `fileType="ICO / PNG"` ; manifest : `accept="application/json,.webmanifest"` `fileType="JSON"`.
- [ ] **Step 2:** Payload + FormData (`faviconFile`, `manifestFile`) comme `watermarkFile`.
- [ ] **Step 3:** Locales en/fr (labels des deux champs).
- [ ] **Step 4:** Build admin OK ; test manuel du formulaire si possible.

### Task 5: Vérification bout en bout

- [ ] Uploader favicon + manifest via le BO → `GET /instance/favicon` et `/instance/manifest` renvoient les fichiers.
- [ ] `index.html` avec `VITE_APP_FAVICON=https://<api>/instance/favicon` et `VITE_APP_MANIFEST=https://<api>/instance/manifest` au build → placeholders remplacés.
- [ ] Plus aucune manipulation de `document.title`/favicon dans `app/src`.
