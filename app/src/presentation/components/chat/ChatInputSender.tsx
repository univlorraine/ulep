import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { languageOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseBlackSvg, PaperclipSvg, PictureSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Conversation from '../../../domain/entities/chat/Conversation';
import { MessageType } from '../../../domain/entities/chat/Message';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import AudioLine from '../AudioLine';
import VocabularyListCard from '../card/VocabularyListCard';
import SelectVocabularyListModal from '../modals/SelectVocabularyListModal';
import RecordingButton from '../RecordingButton';
import styles from './ChatInputSender.module.css';

interface ChatInputSenderProps {
    isBlocked: boolean;
    isCommunity: boolean;
    conversation: Conversation;
    profile: Profile;
    languageCode?: string;
    vocabularyLists: VocabularyList[];
    handleSendMessage: (
        conversation: Conversation,
        message: string,
        file?: File,
        filename?: string,
        type?: MessageType,
        metadata?: any
    ) => void;
}

const ChatInputSender: React.FC<ChatInputSenderProps> = ({
    isBlocked,
    isCommunity,
    conversation,
    handleSendMessage,
    profile,
    vocabularyLists,
}) => {
    const { t } = useTranslation();
    const { cameraAdapter, fileAdapter, recorderAdapter } = useConfig();
    const [showToast] = useIonToast();
    const [message, setMessage] = useState('');
    const [openVocabularyListModal, setOpenVocabularyListModal] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [imageToSend, setImageToSend] = useState<File | undefined>(undefined);
    const [audioFile, setAudioFile] = useState<File | undefined>(undefined);
    const [fileToSend, setFileToSend] = useState<File | undefined>(undefined);
    const [selectedVocabularyList, setSelectedVocabularyList] = useState<VocabularyList | undefined>(undefined);

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

        if (image && image.size > 10000000) {
            return showToast({
                message: t('errors.fileSizeExceed', { maxSize: 10 }),
                duration: 5000,
            });
        }

        if (image) {
            setImageToSend(image);
            setMessage('');
        }
    };

    const handleFileClick = async () => {
        if (isBlocked) {
            return;
        }
        const file = await fileAdapter.getFile({ isTypeOnlyPdf: false });

        if (file && file.size > 10000000) {
            return showToast({
                message: t('errors.fileSizeExceed', { maxSize: 10 }),
                duration: 5000,
            });
        }

        if (file) {
            setFileToSend(file);
        }
    };

    const handleVocabularyListClick = async () => {
        if (isBlocked) {
            return;
        }
        setOpenVocabularyListModal(true);
    };

    const handleSelectedVocabularyList = (vocabularyList: VocabularyList) => {
        setSelectedVocabularyList(vocabularyList);
        setOpenVocabularyListModal(false);
    };

    const onSendPressed = async () => {
        if (isRecording || (!message && !imageToSend && !audioFile && !fileToSend && !selectedVocabularyList)) {
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
        const content = selectedVocabularyList ? selectedVocabularyList.id : message;
        const type = selectedVocabularyList ? MessageType.Vocabulary : undefined;
        handleSendMessage(conversation, content, file, filename, type, { vocabularyList: selectedVocabularyList });

        setMessage('');
        setImageToSend(undefined);
        setAudioFile(undefined);
        setFileToSend(undefined);
        setSelectedVocabularyList(undefined);
    };

    useEffect(() => {
        setMessage('');
        setImageToSend(undefined);
        setAudioFile(undefined);
        setFileToSend(undefined);
        setSelectedVocabularyList(undefined);
    }, [conversation]);

    return (
        <div className={styles.footer}>
            <div>
                <IonButton
                    fill="clear"
                    size="small"
                    onClick={handleImageClick}
                    aria-label={t('chat.send_image_aria_label') as string}
                >
                    <IonIcon className={styles.icon} icon={PictureSvg} />
                </IonButton>
                <IonButton
                    fill="clear"
                    size="small"
                    onClick={handleFileClick}
                    aria-label={t('chat.send_file_aria_label') as string}
                >
                    <IonIcon className={styles.icon} icon={PaperclipSvg} />
                </IonButton>
                {isCommunity && vocabularyLists.length > 0 && (
                    <IonButton
                        fill="clear"
                        size="small"
                        onClick={handleVocabularyListClick}
                        aria-label={t('chat.send_vocabulary_list_aria_label') as string}
                    >
                        <IonIcon className={styles.icon} icon={languageOutline} />
                    </IonButton>
                )}
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
                {vocabularyLists && selectedVocabularyList && (
                    <VocabularyListCard vocabularyList={selectedVocabularyList} />
                )}
                {!imageToSend && !audioFile && !fileToSend && !selectedVocabularyList && (
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
                    hideRecordButton={isCommunity}
                />
            </div>
            {isCommunity && (
                <SelectVocabularyListModal
                    isVisible={openVocabularyListModal}
                    onClose={() => setOpenVocabularyListModal(false)}
                    onValidate={handleSelectedVocabularyList}
                    profile={profile}
                    vocabularyLists={vocabularyLists}
                />
            )}
        </div>
    );
};

export default ChatInputSender;
