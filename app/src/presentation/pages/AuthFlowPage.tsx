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

import { IonPage, useIonToast } from '@ionic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Profile from '../../domain/entities/Profile';
import User from '../../domain/entities/User';
import { useStoreActions } from '../../store/storeTypes';
import CenterLayout from '../components/layout/CenterLayout';
import Loader from '../components/Loader';

const AuthPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const { browserAdapter, deviceAdapter, getProfile, getUser, getTokenFromCodeUsecase } = useConfig();
    const setProfile = useStoreActions((store) => store.setProfile);
    const setUser = useStoreActions((store) => store.setUser);
    const history = useHistory();
    const [showToast] = useIonToast();

    const getAccessToken = async (code: string) => {
        const result = await getTokenFromCodeUsecase.execute({
            code,
            redirectUri: deviceAdapter.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`,
        });

        // Close browser after the user is redirected to the app (mobile only)
        if (deviceAdapter.isNativePlatform()) {
            await browserAdapter.close();
        }

        if (result instanceof Error) {
            await showToast(t('global.error'), 5000);
            return history.goBack();
        }

        const resultProfile = await getProfile.execute(result.accessToken);
        if (resultProfile instanceof Profile) {
            setProfile({ profile: resultProfile });
            return history.push('/home');
        }

        const resultUser = await getUser.execute(result.accessToken);
        if (resultUser instanceof User) {
            setUser({ user: resultUser });
            return history.push('/signup/languages');
        }

        return history.push('/signup', { fromIdp: true });
    };

    useEffect(() => {
        if (code) {
            getAccessToken(code);
        }
    }, [code]);

    return (
        <IonPage>
            <CenterLayout>
                <Loader height="150" width="150" wrapperStyle={{}} wrapperClass="" />
            </CenterLayout>
        </IonPage>
    );
};

export default AuthPage;
