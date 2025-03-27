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

import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { Box, IconButton, Input } from '@mui/material';
import { useRef, useState } from 'react';
import { useDataProvider, useNotify } from 'react-admin';
import { Conversation } from '../../entities/Conversation';
import { MessageWithConversationId, UserChat } from '../../entities/Message';
import SocketIoProvider from '../../providers/socketIoProvider';
import AudioLine from './AudioLine';
import RecordingButton from './RecordingButton';
import useAudioRecorder from './useAudioRecorder';

interface ChatInputSenderProps {
    conversation: Conversation;
    profile: UserIdentity;
    socketIoProvider?: SocketIoProvider;
}

const styles = {
    closeContainer: {
        borderRadius: '50%',
        position: 'relative',
        padding: '2px',
    },
    closeButton: {
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'white',
        position: 'absolute',
        padding: '2px',
        top: -10,
        right: -10,
        height: 30,
        width: 30,
    },
};

const ChatInputSender = ({ conversation, profile, socketIoProvider }: ChatInputSenderProps) => {
    const [message, setMessage] = useState<string>('');
    const [fileToSend, setFileToSend] = useState<File | undefined>();
    const [audioFile, setAudioFile] = useState<File | undefined>();
    const [imageToSend, setImageToSend] = useState<File | undefined>();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const { hasPermission, isRecording, startRecording, stopRecording } = useAudioRecorder();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleStartRecord = () => {
        // If we are already recording or if we have an audio file, we don't want to start a new recording
        if (isRecording || audioFile) {
            return;
        }
        startRecording();
    };

    const handleStopRecord = async () => {
        setAudioFile(await stopRecording());
    };

    const onSendPressed = async () => {
        if (isRecording || (!message && !imageToSend && !audioFile && !fileToSend)) {
            return;
        }

        let file: File | undefined;
        let filename: string | undefined;
        if (audioFile) {
            file = audioFile;
            filename = audioFile.name;
        } else if (imageToSend) {
            file = imageToSend;
            filename = imageToSend.name;
        } else if (fileToSend) {
            file = fileToSend;
            filename = fileToSend.name;
        }

        setMessage('');
        setImageToSend(undefined);
        setAudioFile(undefined);
        setFileToSend(undefined);

        const messageResult = await dataProvider.sendMessage(conversation.id, profile.id, message, file, filename);

        if (messageResult.data instanceof Error) {
            notify(messageResult.message);

            return;
        }
        const messageReceived = messageResult.data;
        socketIoProvider?.emit(
            new MessageWithConversationId(
                messageReceived.id,
                messageReceived.content,
                messageReceived.createdAt,
                new UserChat(profile.id, profile.firstName, profile.lastName, profile.email || '', true),
                messageReceived.type,
                conversation.id,
                messageReceived.metadata
            )
        );
    };

    const onFilePressed = () => {
        if (isRecording) {
            return;
        }
        fileInputRef.current?.click();
    };

    const onImagePressed = () => {
        if (isRecording) {
            return;
        }
        imageInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImageToSend(event.target.files[0]);
            setAudioFile(undefined);
            setFileToSend(undefined);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileToSend(event.target.files[0]);
            setAudioFile(undefined);
            setImageToSend(undefined);
        }
    };

    return (
        <Box>
            <Box style={{ margin: 8 }}>
                <IconButton onClick={onImagePressed} size="small">
                    <InsertPhotoIcon />
                    <input
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        type="file"
                    />
                </IconButton>
                <IconButton onClick={onFilePressed} size="small">
                    <AttachFileIcon />
                    <input
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        type="file"
                    />
                </IconButton>
            </Box>
            <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                style={{ margin: 8 }}
            >
                {imageToSend && (
                    <Box sx={styles.closeContainer}>
                        <IconButton
                            onClick={() => setImageToSend(undefined)}
                            sx={{ ...styles.closeButton, top: 0, right: 0 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <img
                            alt="imageToSend"
                            src={URL.createObjectURL(imageToSend)}
                            style={{
                                borderRadius: 10,
                                margin: 12,
                                objectFit: 'cover',
                                objectPosition: 'center',
                                height: 100,
                                width: 100,
                            }}
                        />
                    </Box>
                )}
                {audioFile && (
                    <Box sx={styles.closeContainer}>
                        <IconButton onClick={() => setAudioFile(undefined)} sx={styles.closeButton}>
                            <CloseIcon />
                        </IconButton>
                        <AudioLine audioFile={audioFile} />
                    </Box>
                )}
                {fileToSend && (
                    <Box sx={styles.closeContainer}>
                        <IconButton onClick={() => setFileToSend(undefined)} sx={styles.closeButton}>
                            <CloseIcon />
                        </IconButton>
                        <Box
                            sx={{
                                backgroundColor: 'secondary.main',
                                textTransform: 'none',
                                borderRadius: 2,
                                padding: 2,
                            }}
                        >
                            {decodeURI(fileToSend.name)}
                        </Box>
                    </Box>
                )}
                {!imageToSend && !fileToSend && !audioFile && (
                    <Input
                        maxRows={4}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ width: '90%' }}
                        value={message}
                        multiline
                    />
                )}
                <RecordingButton
                    handleStartRecord={handleStartRecord}
                    handleStopRecord={handleStopRecord}
                    hasPermission={hasPermission}
                    mode={message || audioFile || imageToSend || fileToSend ? 'send' : 'record'}
                    onSendPressed={onSendPressed}
                />
            </Box>
        </Box>
    );
};

export default ChatInputSender;
