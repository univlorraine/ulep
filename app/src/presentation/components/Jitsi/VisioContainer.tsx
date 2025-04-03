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

import { IonLoading, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import { UserChat } from '../../../domain/entities/User';
import { useStoreState } from '../../../store/storeTypes';
import useGetHomeData from '../../hooks/useGetHomeData';
import JitsiMobile from './JitsiMobile';
import JitsiWeb from './JitsiWeb';

export interface JitsiProps {
    jitsiUrl: string;
    language: string;
    roomName: string;
    jitsiToken: string;
    tandem?: Tandem;
}

interface VisioContainerProps {
    tandemPartner?: Profile | UserChat;
    learningLanguageId: string;
}

const isProfile = (obj: any): obj is Profile => {
    return obj && obj.user && typeof obj.user.firstname === 'string' && typeof obj.user.lastname === 'string';
};

const VisioContainer = () => {
    const { i18n } = useTranslation();
    const location = useLocation<VisioContainerProps>();
    const { accessToken, getJitsiToken, updateVisioDuration } = useConfig();
    const history = useHistory();
    const [jitsiToken, setJitsiToken] = useState<string>();
    const jitsiUrl = useStoreState((state) => state.jitsiUrl);
    const roomName = location.search ? location.search.split('roomName=')[1] : '';
    const { tandemPartner, learningLanguageId } = location.state || {};
    const { tandems, isLoading } = useGetHomeData();
    const tandem = tandems.find((t) => t.id === roomName);

    const fetchJitsiToken = async () => {
        const response = await getJitsiToken.execute(accessToken);

        if (response instanceof Error) {
            return history.push('/home');
        }

        return setJitsiToken(response.token);
    };

    useEffect(() => {
        fetchJitsiToken();
    }, []);

    useEffect(() => {
        if (!tandemPartner) {
            return;
        }

        const firstname = isProfile(tandemPartner) ? tandemPartner.user.firstname : tandemPartner.firstname;
        const lastname = isProfile(tandemPartner) ? tandemPartner.user.lastname : tandemPartner.lastname;

        const interval = setInterval(() => {
            updateVisioDuration.execute({
                learningLanguageId,
                roomName,
                partnerTandemId: tandemPartner.id,
                partnerFirstname: firstname,
                partnerLastname: lastname,
            });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading || roomName === '' || !jitsiToken) {
        return <IonLoading isOpen={true} />;
    }

    if (isPlatform('cordova')) {
        // native device, open jitsi capacitor plugin
        return (
            <JitsiMobile
                jitsiUrl={jitsiUrl}
                language={i18n.language}
                roomName={roomName}
                jitsiToken={jitsiToken}
                tandem={tandem}
            />
        );
    } else {
        return (
            <JitsiWeb
                jitsiUrl={jitsiUrl}
                language={i18n.language}
                roomName={roomName}
                jitsiToken={jitsiToken}
                tandem={tandem}
            />
        );
    }
};

export default VisioContainer;
