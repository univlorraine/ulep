/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité du code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { useIonToast } from '@ionic/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../context/ConfigurationContext';

interface UseVideoCallPermissionsReturn {
    requestPermissionsAndNavigate: (roomName: string, state?: any) => Promise<void>;
}

export const useVideoCallPermissions = (): UseVideoCallPermissionsReturn => {
    const history = useHistory();
    const { deviceAdapter, cameraAdapter } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();

    const requestPermissionsAndNavigate = useCallback(
        async (roomName: string, state?: any) => {
            try {
                if (deviceAdapter.isAndroid() || deviceAdapter.isIos()) {
                    const hasPermissions = await cameraAdapter.requestVideoCallPermissions();

                    if (!hasPermissions) {
                        showToast({
                            message: t('video_call.permissions_required') as string,
                            duration: 3000,
                            color: 'warning',
                        });
                        return;
                    }
                }

                history.push({
                    pathname: '/jitsi',
                    search: `?roomName=${roomName}`,
                    state,
                });
            } catch (error) {
                console.error('Error requesting video call permissions:', error);
                showToast({
                    message: t('video_call.permissions_error') as string,
                    duration: 3000,
                    color: 'danger',
                });
            }
        },
        [history, deviceAdapter, cameraAdapter, t, showToast]
    );

    return {
        requestPermissionsAndNavigate,
    };
};
