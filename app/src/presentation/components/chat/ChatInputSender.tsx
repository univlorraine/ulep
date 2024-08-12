import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseBlackSvg, PaperclipSvg, PictureSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import { UserChat } from '../../../domain/entities/User';
import Conversation from '../../../domain/entities/chat/Conversation';
import { MessageWithConversationId } from '../../../domain/entities/chat/Message';
import AudioLine from '../AudioLine';
import RecordingButton from '../RecordingButton';
import styles from './ChatInputSender.module.css';

interface ChatInputSenderProps {
    isBlocked: boolean;
    profile: Profile;
    conversation: Conversation;
}

const ChatInputSender: React.FC<ChatInputSenderProps> = ({ isBlocked, profile, conversation }) => {
    const { t } = useTranslation();
    const { cameraAdapter, fileAdapter, recorderAdapter, sendMessage, socketIoAdapter } = useConfig();
    const [showToast] = useIonToast();
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [imageToSend, setImageToSend] = useState<File | undefined>(undefined);
    const [audioFile, setAudioFile] = useState<File | undefined>(undefined);
    const [fileToSend, setFileToSend] = useState<File | undefined>(undefined);

    const handleStartRecord = () => {
        // If we are already recording or if we have an audio file, we don't want to start a new recording
        if (isRecording || audioFile) {
            return;
        }

        setIsRecording(true);
        recorderAdapter.startRecording((audio, error) => {
            if (error) {
                return showToast({
                    message: t(error.message),
                    duration: 5000,
                });
            }
            setIsRecording(false);
            setAudioFile(audio);
        });
    };

    const handleStopRecord = () => {
        setIsRecording(false);
        recorderAdapter.stopRecording((audio, error) => {
            if (error) {
                return showToast({
                    message: t(error.message),
                    duration: 5000,
                });
            }
            setIsRecording(false);
            setAudioFile(audio);
        });
    };

    const handleImageClick = async () => {
        if (isBlocked) {
            return;
        }
        const image = await cameraAdapter.getPictureFromGallery();
        if (image) {
            setImageToSend(image);
            setMessage('');
        }
    };

    const handleFileClick = async () => {
        if (isBlocked) {
            return;
        }
        const file = await fileAdapter.getFile();
        if (file) {
            setFileToSend(file);
        }
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

        const messageResult = await sendMessage.execute(conversation.id, profile.user.id, message, file, filename);

        if (messageResult instanceof Error) {
            return showToast({
                message: t(messageResult.message),
                duration: 5000,
            });
        }

        socketIoAdapter.emit(
            new MessageWithConversationId(
                messageResult.id,
                messageResult.content,
                messageResult.createdAt,
                new UserChat(
                    profile.user.id,
                    profile.user.firstname,
                    profile.user.lastname,
                    profile.user.email,
                    false,
                    profile.user.avatar
                ),
                messageResult.type,
                conversation.id,
                messageResult.metadata
            )
        );
    };

    return (
        <div className={styles.footer}>
            <div>
                <IonButton fill="clear" size="small" onClick={handleImageClick}>
                    <IonIcon className={styles.icon} icon={PictureSvg} />
                </IonButton>
                <IonButton fill="clear" size="small" onClick={handleFileClick}>
                    <IonIcon className={styles.icon} icon={PaperclipSvg} />
                </IonButton>
            </div>
            <div className={styles['sender-view']}>
                {imageToSend && (
                    <div className={styles['preview-container']}>
                        <button className={styles['cancel-image-button']} onClick={() => setImageToSend(undefined)}>
                            <img src={CloseBlackSvg} />
                        </button>
                        <img className={styles['preview-image']} src={URL.createObjectURL(imageToSend)} />
                    </div>
                )}
                {audioFile && (
                    <div className={styles['preview-audio-container']}>
                        <button className={styles['cancel-audio-button']} onClick={() => setAudioFile(undefined)}>
                            <img src={CloseBlackSvg} style={{ filter: 'invert(1)' }} />
                        </button>
                        <AudioLine audioFile={audioFile} />
                    </div>
                )}
                {fileToSend && (
                    <div className={styles['preview-file-container']}>
                        <button className={styles['cancel-audio-button']} onClick={() => setFileToSend(undefined)}>
                            <img src={CloseBlackSvg} style={{ filter: 'invert(1)' }} />
                        </button>
                        <span>{fileToSend.name}</span>
                    </div>
                )}
                {!imageToSend && !audioFile && !fileToSend && (
                    <textarea
                        className={styles.input}
                        maxLength={1000}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                            t(isBlocked ? 'chat.input.placeholder.blocked' : 'chat.input.placeholder.unblocked') ?? ''
                        }
                        value={message}
                        disabled={isBlocked}
                    />
                )}
                <RecordingButton
                    mode={message || imageToSend || audioFile || fileToSend ? 'send' : 'record'}
                    onSendPressed={onSendPressed}
                    handleStartRecord={handleStartRecord}
                    handleStopRecord={handleStopRecord}
                    isBlocked={isBlocked}
                />
            </div>
        </div>
    );
};

export default ChatInputSender;
