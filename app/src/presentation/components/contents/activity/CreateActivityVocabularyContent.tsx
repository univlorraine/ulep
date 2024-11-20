import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { addSharp, trashBinOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity } from '../../../../domain/entities/Activity';
import AudioLine from '../../AudioLine';
import RecordingButton from '../../RecordingButton';
import TextInput from '../../TextInput';
import styles from './CreateActivityVocabularyContent.module.css';

interface CreateActivityVocabularyContentProps {
    onSubmit: (vocabularies: { content: string; file?: File }[], vocabulariesToDelete?: string[]) => void;
    onBackPressed: () => void;
    activityToUpdate?: Activity;
}

export const CreateActivityVocabularyContent: React.FC<CreateActivityVocabularyContentProps> = ({
    onSubmit,
    onBackPressed,
    activityToUpdate,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { recorderAdapter } = useConfig();
    const [vocabularies, setVocabularies] = useState<
        { id?: string; content: string; file?: File; pronunciationUrl?: string }[]
    >(activityToUpdate?.vocabularies ?? []);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const handleDeleteVocabulary = (index: number) => {
        const newVocabularies = vocabularies.filter((_, i) => i !== index);
        setVocabularies(newVocabularies);
    };

    const handleSubmit = () => {
        onSubmit(vocabularies);
    };

    const onAddVocabularyPressed = () => {
        setVocabularies([...vocabularies, { content: '', file: undefined }]);
    };

    const onDeletePronunciation = (index: number) => {
        const newVocabularies = [...vocabularies];
        newVocabularies[index].file = undefined;
        newVocabularies[index].pronunciationUrl = undefined;
        setVocabularies(newVocabularies);
    };

    const onUpdateContentVocabulary = (content: string, index: number) => {
        const newVocabularies = [...vocabularies];
        newVocabularies[index].content = content;
        setVocabularies(newVocabularies);
    };

    const handleStartRecord = (index: number) => {
        if (isRecording) {
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
            const newVocabularies = [...vocabularies];
            newVocabularies[index].file = audio;
            setVocabularies(newVocabularies);
        });
    };

    const handleStopRecord = (index: number) => {
        setIsRecording(false);
        recorderAdapter.stopRecording((audio, error) => {
            if (error) {
                return showToast({
                    message: t(error.message),
                    duration: 5000,
                });
            }
            setIsRecording(false);
            const newVocabularies = [...vocabularies];
            newVocabularies[index].file = audio;
            setVocabularies(newVocabularies);
        });
    };

    const allVocabulariesAreFilled = vocabularies.every((vocabulary) => vocabulary.content !== '');

    return (
        <div>
            <h1 className="title">{t('activity.create.title_vocabulary')}</h1>
            <p className="subtitle">{t('activity.create.subtitle_vocabulary')}</p>

            {vocabularies.map((vocabulary, index) => (
                <div className={styles['vocabulary-line']}>
                    <div className={styles['vocabulary-container']}>
                        <TextInput
                            title=""
                            onChange={(content) => onUpdateContentVocabulary(content, index)}
                            placeholder={t('activity.create.vocabulary_placeholder') as string}
                            maxLength={30}
                            value={vocabulary.content}
                        />
                        <div className={styles['pronunciation-container']}>
                            <div className={styles['player-line']}>
                                <span className={styles['pronunciation']}>{t('activity.create.pronunciation')}</span>
                                {(vocabulary.file || vocabulary.pronunciationUrl) && (
                                    <AudioLine
                                        audioFile={(vocabulary.file || vocabulary.pronunciationUrl)!}
                                        hideProgressBar
                                        small
                                    />
                                )}
                            </div>
                            {vocabulary.file || vocabulary.pronunciationUrl ? (
                                <IonButton
                                    className={styles['delete-pronunciation']}
                                    fill="clear"
                                    onClick={() => onDeletePronunciation(index)}
                                >
                                    {t('activity.create.delete_pronunciation')}
                                </IonButton>
                            ) : (
                                <RecordingButton
                                    mode="record"
                                    handleStartRecord={() => handleStartRecord(index)}
                                    handleStopRecord={() => handleStopRecord(index)}
                                    isBlocked={false}
                                    hideSendButton
                                />
                            )}
                        </div>
                    </div>
                    <IonButton
                        fill="clear"
                        onClick={() => handleDeleteVocabulary(index)}
                        aria-label={t('activity.create.delete_vocabulary_button') as string}
                    >
                        <IonIcon icon={trashBinOutline} color="dark" aria-hidden />
                    </IonButton>
                </div>
            ))}

            <IonButton
                fill="clear"
                className="tertiary-button no-padding margin-bottom"
                onClick={onAddVocabularyPressed}
            >
                <IonIcon icon={addSharp} aria-hidden />
                {t('activity.create.add_vocabulary_button')}
            </IonButton>
            <div className={`${styles['button-container']} large-margin-top`}>
                <IonButton fill="clear" className="tertiary-button no-padding" onClick={onBackPressed}>
                    {t('activity.create.cancel_button')}
                </IonButton>
                <IonButton
                    fill="clear"
                    className={`primary-button no-paddin ${allVocabulariesAreFilled ? '' : 'disabled'}`}
                    onClick={handleSubmit}
                    disabled={!allVocabulariesAreFilled}
                >
                    {t('activity.create.validate_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default CreateActivityVocabularyContent;
