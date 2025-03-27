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
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { useRef } from 'react';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreState } from '../../../store/storeTypes';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import HomeHeader from '../HomeHeader';
import styles from './JitsiWeb.module.css';
import { JitsiProps } from './VisioContainer';
import VisioInfoFrame from './VisioInfoFrame';

const JitsiWeb = ({ jitsiUrl, language, roomName, jitsiToken, tandem }: JitsiProps) => {
    const history = useHistory();
    const apiRef = useRef<IJitsiMeetExternalApi>();
    const { width } = useWindowDimensions();
    const { sendMessage } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const isHybrid = width < HYBRID_MAX_WIDTH;

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
        apiRef.current = apiObj;
        apiRef.current.on('outgoingMessage', handleOutgoingMessage);
    };

    const handleOutgoingMessage = (payload: {
        privateMessage: boolean; // whether this is a private or group message
        message: string; // the text of the message
    }) => {
        if (!roomName) {
            return;
        }

        const result = sendMessage.execute({
            conversationId: roomName,
            senderId: profile.user.id,
            content: payload.message,
        });

        if (result instanceof Error) {
            console.error(result);
        }
    };

    return (
        <div className={styles.container}>
            {!isHybrid && <HomeHeader />}
            <div className={styles.content}>
                <JitsiMeeting
                    domain={jitsiUrl}
                    lang={language}
                    roomName={roomName}
                    jwt={jitsiToken}
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
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        DEFAULT_LOCAL_DISPLAY_NAME: language.toUpperCase(),
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
                    onApiReady={(externalApi) => {
                        // here you can attach custom event listeners to the Jitsi Meet External API
                        // you can also store it locally to execute commands
                        handleApiReady(externalApi);
                    }}
                    onReadyToClose={() => {
                        isHybrid
                            ? history.push('/end-session', { tandem })
                            : history.push('/home', { tandem, endSession: true });
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = isHybrid ? '100%' : 'calc(100vh - 80px)';
                        iframeRef.style.flex = '1';
                    }}
                />
                {!isHybrid && <VisioInfoFrame tandem={tandem} />}
            </div>
        </div>
    );
};

export default JitsiWeb;
