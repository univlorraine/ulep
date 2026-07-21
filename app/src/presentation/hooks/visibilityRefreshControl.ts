/**
 * Contrôle partagé pour suspendre temporairement le rafraîchissement
 * automatique déclenché par `useAppVisibilityRefresh` lors d'un retour au
 * premier plan.
 *
 * On l'utilise autour des allers-retours natifs volontaires (sélecteur de
 * fichiers, caméra, partage…) qui mettent brièvement l'app en arrière-plan :
 * sans cela, `visibilitychange` déclencherait un `window.location.reload()`
 * qui détruirait l'état React en cours (par ex. le fichier tout juste
 * sélectionné dans le chat).
 */

let suspendCount = 0;

export const suspendVisibilityRefresh = () => {
    suspendCount += 1;
};

export const resumeVisibilityRefresh = () => {
    suspendCount = Math.max(0, suspendCount - 1);
};

export const isVisibilityRefreshSuspended = () => suspendCount > 0;
