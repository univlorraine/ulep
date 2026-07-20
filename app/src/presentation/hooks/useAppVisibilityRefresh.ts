import { useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import { isVisibilityRefreshSuspended } from './visibilityRefreshControl';

/**
 * Hook pour rafraîchir la page quand l'app revient au premier plan sur mobile
 * Cela force une reconnexion socket après une sortie de veille
 */
export const useAppVisibilityRefresh = () => {
    const { deviceAdapter } = useConfig();

    useEffect(() => {
        // Seulement sur mobile natif
        if (!deviceAdapter.isNativePlatform()) {
            return;
        }

        const handleVisibilityChange = () => {
            // Quand l'app redevient visible (revient au premier plan)
            if (!document.hidden) {
                // Ne pas recharger si on revient d'un plugin natif volontaire
                // (sélecteur de fichiers, caméra, partage…) : cela détruirait
                // l'état React en cours (ex. le fichier sélectionné).
                if (isVisibilityRefreshSuspended()) {
                    return;
                }
                window.location.reload();
            }
        };

        // Écouter les changements de visibilité
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [deviceAdapter]);
};
