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

import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotify, useTranslate } from 'react-admin';

interface RecordingButtonProps {
    mode: 'send' | 'record';
    onSendPressed?: () => void;
    handleStartRecord: () => void;
    handleStopRecord: () => void;
    hasPermission: boolean;
}

const RecordingButton = ({
    mode,
    onSendPressed,
    handleStartRecord,
    handleStopRecord,
    hasPermission,
}: RecordingButtonProps) => {
    const [recording, setRecording] = useState(false);
    const [time, setTime] = useState(0);
    const translate = useTranslate();
    const notify = useNotify();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (recording && mode === 'record') {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (recording && mode === 'send') {
            setRecording(false);
            clearInterval(timer!);
            setTime(0);
        }

        return () => clearInterval(timer);
    }, [recording, mode]);

    const startRecording = () => {
        if (mode === 'send') {
            return;
        }

        if (!hasPermission) {
            notify(translate('chat.audioRecorder.permission'));
        } else {
            setRecording(true);
            handleStartRecord();
        }
    };

    const stopRecording = () => {
        if (mode === 'send') {
            return;
        }
        if (!hasPermission) {
            notify(translate('chat.audioRecorder.permission'));
        } else {
            setRecording(false);
            setTime(0);
            handleStopRecord();
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {recording && (
                <div
                    style={{
                        zIndex: 1000,
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '12px',
                    }}
                >
                    {time}s
                </div>
            )}
            <IconButton
                onClick={onSendPressed}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchEnd={stopRecording}
                onTouchStart={startRecording}
                style={{ backgroundColor: 'black', borderRadius: '50%', padding: '10px' }}
            >
                {mode === 'send' ? (
                    <SendIcon style={{ color: 'white' }} />
                ) : (
                    <KeyboardVoiceIcon style={{ color: 'white' }} />
                )}
            </IconButton>
        </Box>
    );
};

export default RecordingButton;
