import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { languageOutline, newspaperOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseBlackSvg, PaperclipSvg, PictureSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { Activity } from '../../../domain/entities/Activity';
import Conversation from '../../../domain/entities/chat/Conversation';
import Hashtag from '../../../domain/entities/chat/Hashtag';
import { MessageType } from '../../../domain/entities/chat/Message';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import AudioLine from '../AudioLine';
import SmallActivityCard from '../card/SmallActivityCard';
import VocabularyListCard from '../card/VocabularyListCard';
import SelectActivitiesListModal from '../modals/SelectActivitiesListModal';
import SelectVocabularyListModal from '../modals/SelectVocabularyListModal';
import RecordingButton from '../RecordingButton';
import styles from './ChatInputSender.module.css';
import HashtagsHeader from './HashtagsHeader';

interface ChatInputSenderProps {
    hashtags: Hashtag[];
    isBlocked: boolean;
    isCommunity: boolean;
    conversation: Conversation;
    profile: Profile;
    languageCode?: string;
    vocabularyLists: VocabularyList[];
    activities: Activity[];
    isReplayMode: boolean;
    searchHashtag: (hashtag?: Hashtag) => void;
    isHastagsLoading: boolean;
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
    hashtags,
    isBlocked,
    isCommunity,
    conversation,
    handleSendMessage,
    profile,
    vocabularyLists,
    activities,
    searchHashtag,
    isReplayMode,
    isHastagsLoading,
}) => {
    const { t } = useTranslation();
    const { cameraAdapter, fileAdapter, recorderAdapter } = useConfig();
    const [showToast] = useIonToast();
    const [message, setMessage] = useState('');
    const [openVocabularyListModal, setOpenVocabularyListModal] = useState<boolean>(false);
    const [openActivitiesListModal, setOpenActivitiesListModal] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [imageToSend, setImageToSend] = useState<File | undefined>(undefined);
    const [audioFile, setAudioFile] = useState<File | undefined>(undefined);
    const [fileToSend, setFileToSend] = useState<File | undefined>(undefined);
    const [selectedVocabularyList, setSelectedVocabularyList] = useState<VocabularyList | undefined>(undefined);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

    const handleClearState = ({
        imageToSend,
        audioFile,
        fileToSend,
        selectedVocabularyList,
        selectedActivity,
    }: {
        imageToSend?: File;
        audioFile?: File;
        fileToSend?: File;
        selectedVocabularyList?: VocabularyList;
        selectedActivity?: Activity;
    }) => {
        setImageToSend(imageToSend);
        setAudioFile(audioFile);
        setFileToSend(fileToSend);
        setSelectedVocabularyList(selectedVocabularyList);
        setSelectedActivity(selectedActivity);
        setMessage('');
        setOpenVocabularyListModal(false);
        setOpenActivitiesListModal(false);
    };

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
            handleClearState({
                imageToSend: image,
            });
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
            handleClearState({
                fileToSend: file,
            });
        }
    };

    const handleVocabularyListClick = async () => {
        if (isBlocked) {
            return;
        }
        setOpenVocabularyListModal(true);
    };

    const handleActivitiesListClick = async () => {
        if (isBlocked) {
            return;
        }
        setOpenActivitiesListModal(true);
    };

    const handleSelectedVocabularyList = (vocabularyList: VocabularyList) => {
        handleClearState({
            selectedVocabularyList: vocabularyList,
        });
    };

    const handleSelectedActivity = (activity: Activity) => {
        handleClearState({
            selectedActivity: activity,
        });
    };

    const onSendPressed = async () => {
        if (
            isRecording ||
            (!message && !imageToSend && !audioFile && !fileToSend && !selectedVocabularyList && !selectedActivity)
        ) {
            return;
        }

        let file: File | undefined;
        let filename: string | undefined;
        let content: string;
        let type: MessageType | undefined;
        let metadata: { vocabularyList?: VocabularyList; activity?: Activity } | undefined;
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

        if (selectedVocabularyList) {
            content = selectedVocabularyList.id;
            type = MessageType.Vocabulary;
            metadata = { vocabularyList: selectedVocabularyList };
        } else if (selectedActivity) {
            content = selectedActivity.id;
            type = MessageType.Activity;
            metadata = { activity: selectedActivity };
        } else {
            content = message;
        }

        handleSendMessage(conversation, content, file, filename, type, metadata);

        setMessage('');
        setImageToSend(undefined);
        setAudioFile(undefined);
        setFileToSend(undefined);
        setSelectedVocabularyList(undefined);
        setSelectedActivity(undefined);
    };

    useEffect(() => {
        handleClearState({});
    }, [conversation]);

    return (
        <div className={styles.footer}>
            {hashtags.length > 0 && !isHastagsLoading && !isReplayMode && (
                <HashtagsHeader hashtags={hashtags} onSearchHashtag={searchHashtag} />
            )}
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
                {isCommunity && activities.length > 0 && (
                    <IonButton
                        fill="clear"
                        size="small"
                        onClick={handleActivitiesListClick}
                        aria-label={t('chat.send_activity_list_aria_label') as string}
                    >
                        <IonIcon className={styles.icon} icon={newspaperOutline} />
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
                {selectedVocabularyList && <VocabularyListCard vocabularyList={selectedVocabularyList} />}
                {selectedActivity && <SmallActivityCard activity={selectedActivity} />}
                {!imageToSend && !audioFile && !fileToSend && !selectedVocabularyList && !selectedActivity && (
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
                    mode={
                        message || imageToSend || audioFile || fileToSend || selectedVocabularyList || selectedActivity
                            ? 'send'
                            : 'record'
                    }
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
            {isCommunity && (
                <SelectActivitiesListModal
                    isVisible={openActivitiesListModal}
                    onClose={() => setOpenActivitiesListModal(false)}
                    onValidate={handleSelectedActivity}
                    activities={activities}
                />
            )}
        </div>
    );
};

export default ChatInputSender;
