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
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
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

import { IonPage } from '@ionic/react';
import { useState } from 'react';
import { Redirect } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import ProfileContent from '../components/contents/ProfileContent';
import SettingsContent from '../components/contents/SettingsContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import SettingsModal from '../components/modals/SettingsModal';
import useLogout from '../hooks/useLogout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const ProfilePage: React.FC = () => {
    const profile = useStoreState((state) => state.profile);
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const [displaySettings, setDisplaySettings] = useState<boolean>(false);
    const { handleLogout } = useLogout();

    if (!profile) {
        return <Redirect to={'/signup'} />;
    }

    if (isHybrid) {
        return (
            <IonPage>
                {displaySettings ? (
                    <SettingsContent
                        onBackPressed={() => setDisplaySettings(false)}
                        onDisconnect={handleLogout}
                        onLanguageChange={() => {}}
                    />
                ) : (
                    <ProfileContent
                        onDisplaySettings={() => setDisplaySettings(true)}
                        profile={profile}
                        onProfileChange={() => {}}
                    />
                )}
            </IonPage>
        );
    }

    return (
        <>
            <OnlineWebLayout>
                <ProfileContent
                    onDisplaySettings={() => setDisplaySettings(true)}
                    profile={profile}
                    onProfileChange={() => {}}
                />
            </OnlineWebLayout>
            <SettingsModal
                isVisible={displaySettings}
                onClose={() => setDisplaySettings(false)}
                onDisconnect={handleLogout}
                onLanguageChange={() => {}}
            />
        </>
    );
};

export default ProfilePage;
