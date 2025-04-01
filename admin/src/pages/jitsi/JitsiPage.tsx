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

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useEffect, useState } from 'react';
import { Loading, useDataProvider, useLocaleState, useRedirect } from 'react-admin';
import { useLocation } from 'react-router-dom';

const JitsiPage = () => {
    const location = useLocation();
    const redirect = useRedirect();
    const [jitsiToken, setJitsiToken] = useState<string>();
    const jitsiDomain = window.REACT_APP_JITSI_DOMAIN;
    const dataProvider = useDataProvider();
    const [locale] = useLocaleState();

    const roomName = location.search ? location.search.split('roomName=')[1] : '';

    const fetchJitsiToken = async () => {
        const response = await dataProvider.getJitsiToken();

        if (response instanceof Error) {
            redirect('/conversations');
        }

        return setJitsiToken(response.token);
    };

    useEffect(() => {
        fetchJitsiToken();
    }, []);

    if (roomName === '' || !jitsiToken) {
        return <Loading />;
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <JitsiMeeting
                configOverwrite={{
                    // https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-configuration
                    subject: 'ETANDEM',
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    prejoinConfig: {
                        enabled: false,
                    },
                    welcomePage: {
                        enabled: false,
                    },
                    closePage: {
                        enabled: false,
                    },
                }}
                domain={jitsiDomain}
                getIFrameRef={(iframeRef) => {
                    // eslint-disable-next-line no-param-reassign
                    iframeRef.style.height = '100%';
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    DEFAULT_LOCAL_DISPLAY_NAME: locale.toUpperCase(),
                    SHOW_CHROME_EXTENSION_BANNER: true,
                    TOOLBAR_ALWAYS_VISIBLE: true,
                    SETTINGS_SECTIONS: ['devices', 'language'],
                    TOOLBAR_BUTTONS: [
                        'microphone',
                        'camera',
                        'hangup',
                        'desktop',
                        'profile',
                        'chat',
                        'settings',
                        'raisehand',
                        'videoquality',
                    ],
                }}
                jwt={jitsiToken}
                lang={locale}
                onReadyToClose={() => redirect('/chat')}
                roomName={roomName}
            />
        </div>
    );
};

export default JitsiPage;
